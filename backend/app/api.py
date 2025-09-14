from fastapi import FastAPI, Body, Depends, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from app.auth.auth_bearer import JWTBearer
from app.auth.auth_handler import sign_jwt
from app.model import PostSchema, UserSignupSchema, UserLoginSchema, ScanResult
from app.database import user_collection, scan_collection, add_finding, retrieve_scan_findings, retrieve_user_scans
from datetime import datetime, timedelta
import jwt
from bson import ObjectId
import bcrypt
import json
import subprocess
from typing import List
import traceback
import sys


# --- Hugging Face GPT-2 ---
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Load GPT-2 model and tokenizer once
gpt2_model = GPT2LMHeadModel.from_pretrained("gpt2")
gpt2_tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
gpt2_model.eval()

def generate_solution(vuln_name: str, description: str) -> str:
    """
    Generate a recommended solution for a vulnerability using GPT-2.
    Falls back if GPT-2 fails to produce useful text.
    """
    prompt = f"Vulnerability: {vuln_name}\nDescription: {description}\nRecommended Solution:"
    inputs = gpt2_tokenizer.encode(prompt, return_tensors="pt")

    outputs = gpt2_model.generate(
        inputs,
        max_length=200,
        do_sample=True,
        temperature=0.9,
        top_p=0.95,
        num_return_sequences=1,
        pad_token_id=gpt2_tokenizer.eos_token_id
    )

    solution_text = gpt2_tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Extract only the generated part after "Recommended Solution:"
    if "Recommended Solution:" in solution_text:
        solution_text = solution_text.split("Recommended Solution:")[1].strip()

    # Fallback if GPT-2 output is empty
    if not solution_text:
        solution_text = "GPT-2 could not generate a specific fix. Please review the vulnerability manually."

    return solution_text

# --- FastAPI app ---
app = FastAPI()

# CORS settings
origins = ["http://localhost:8080"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

posts = []

@app.get("/", tags=["root"])
async def read_root():
    return {"message": "Welcome to your blog!"}

@app.get("/posts", tags=["posts"])
async def get_posts():
    return {"data": posts}

@app.post("/posts", dependencies=[Depends(JWTBearer())], tags=["posts"])
async def add_post(post: PostSchema):
    post.id = len(posts) + 1
    posts.append(post.dict())
    return {"data": "post added."}

# --- User management ---
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

@app.post("/user/signup", tags=["user"])
def create_user(user: UserSignupSchema = Body(...)):
    existing_user = user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    user.password = hash_password(user.password)
    user_collection.insert_one(user.dict())
    return sign_jwt(user.email)

@app.post("/user/login", tags=["user"])
def user_login(user: UserLoginSchema = Body(...)):
    db_user = user_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"access_token": sign_jwt(user.email)["access_token"]}

# --- Scan endpoint ---
from datetime import datetime
from bson import ObjectId

@app.get("/scan", response_model=List[ScanResult])
async def scan(target: str = Query(...), user_id: str = "example_user_id"):
    """
    Run a nuclei scan, save the scan and findings to the database,
    so that retrieve_user_scans(user_id) will return this scan.
    """
    # --- Create a scan document first ---
    scan_doc = {
        "user_id": user_id,
        "target": target,
        "total_vulns": 0,
        "critical": 0,
        "high": 0,
        "medium": 0,
        "low": 0,
        "status": "running",
        "created_at": datetime.utcnow(),
    }
    scan_id = scan_collection.insert_one(scan_doc).inserted_id

    try:
        result = subprocess.run(
            ["nuclei", "-u", target, "-j"],
            capture_output=True,
            text=True,
            check=True
        )
    except subprocess.CalledProcessError as e:
        # Mark scan as failed
        scan_collection.update_one(
            {"_id": scan_id},
            {"$set": {"status": "failed"}}
        )
        raise HTTPException(status_code=500, detail=f"Nuclei scan failed: {e.stderr}")
    except Exception as e:
        traceback.print_exc(file=sys.stdout)
        scan_collection.update_one(
            {"_id": scan_id},
            {"$set": {"status": "failed"}}
        )
        raise HTTPException(status_code=500, detail=str(e))

    # --- Process results ---
    try:
        lines = result.stdout.strip().split("\n")
        scan_results = []

        severity_counts = {"critical": 0, "high": 0, "medium": 0, "low": 0}

        for line in lines:
            try:
                data = json.loads(line)
                info = data.get("info", {})

                vuln = ScanResult(
                    template_id=data.get("template"),
                    name=info.get("name"),
                    severity=info.get("severity"),
                    host=data.get("host"),
                    description=info.get("description"),
                    matched_at=data.get("matched-at"),
                    extracted_results=data.get("extracted-results"),
                    curl_command=data.get("curl-command"),
                    solution=None
                )

                vuln.solution = generate_solution(
                    vuln.name or vuln.template_id or "Unknown",
                    vuln.description or "No description provided"
                )

                # Count severity
                sev = vuln.severity.lower() if vuln.severity else "low"
                if sev in severity_counts:
                    severity_counts[sev] += 1

                # Save finding
                add_finding({
                    "scan_id": str(scan_id),
                    "template_id": vuln.template_id,
                    "name": vuln.name,
                    "severity": vuln.severity,
                    "host": vuln.host,
                    "description": vuln.description,
                    "matched_at": vuln.matched_at,
                    "extracted_results": vuln.extracted_results,
                    "curl_command": vuln.curl_command,
                    "solution": vuln.solution
                })

                scan_results.append(vuln)

            except Exception as e:
                print(f"JSON parse error: {e}")
                continue

        # Update scan document with results
        scan_collection.update_one(
            {"_id": scan_id},
            {
                "$set": {
                    "status": "completed",
                    "total_vulns": sum(severity_counts.values()),
                    "critical": severity_counts["critical"],
                    "high": severity_counts["high"],
                    "medium": severity_counts["medium"],
                    "low": severity_counts["low"],
                    "finished_at": datetime.utcnow()
                }
            }
        )

        return scan_results

    except Exception as e:
        traceback.print_exc(file=sys.stdout)
        scan_collection.update_one(
            {"_id": scan_id},
            {"$set": {"status": "failed"}}
        )
        raise HTTPException(status_code=500, detail="Failed to process nuclei output")
# --- Scan history endpoint with simple timestamp-based auth ---

SECRET_KEY = "***"  # must match your JWT secret

def verify_token_timestamp(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=403, detail="Missing token")
    try:
        token_type, token = auth_header.split()
        if token_type.lower() != "bearer":
            raise HTTPException(status_code=403, detail="Invalid token")
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        # Optional: check exp if you want
    except Exception:
        raise HTTPException(status_code=403, detail="Invalid token")

@app.get("/scan/history")
def scan_history(token: None = Depends(verify_token_timestamp)):
    """Return all scans for the user (simplified for timestamp auth)"""
    # For demonstration, using a fixed user_id
    user_id = "example_user_id"
    return retrieve_user_scans(user_id)
# --- Dashboard endpoint ---
def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=403, detail="Missing token")
    try:
        token_type, token = auth_header.split()
        if token_type.lower() != "bearer":
            raise HTTPException(status_code=403, detail="Invalid token")
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload.get("user_id")  # return user_id from token
    except Exception:
        raise HTTPException(status_code=403, detail="Invalid token")


@app.get("/dashboard")
def get_dashboard(token: None = Depends(verify_token_timestamp)):
    # Fixed demo user_id (same as /scan/history)
    user_id = "example_user_id"
    scans = retrieve_user_scans(user_id)
    active_scan = scans[0] if scans else None

    # Stats
    stats = [
        {
            "title": "Total Scans",
            "value": str(len(scans)),
            "icon": "Activity",
            "color": "text-matrix",
            "change": "+0%"
        },
        {
            "title": "Total Vulnerabilities",
            "value": str(sum(scan["total_vulns"] for scan in scans)),
            "icon": "AlertTriangle",
            "color": "text-destructive",
            "change": "+0%"
        },
    ]

    # Vulnerability types (last 3 findings of latest scan)
    vulnerability_types = []
    if active_scan:
        findings = retrieve_scan_findings(active_scan["id"])
        vulnerability_types = [
            {"type": f["name"], "severity": f["severity"], "count": 1}
            for f in findings[:3]
        ]

    return {
        "stats": stats,
        "recentScans": scans[:5],
        "activeScan": active_scan,
        "vulnerabilityTypes": vulnerability_types
    }
