from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
from datetime import datetime
from typing import List, Dict, Any, Optional

uri = "mongodb+srv://Dhiaa:Lou2RkhmM1Y94vyP@cluster0.wlci481.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Connect to MongoDB Atlas
client = MongoClient(uri, server_api=ServerApi('1'))

# Choose your database and collections
database = client["user"]  # database name
user_collection = database["users"]  # collection name
scan_collection = database["scans"]  # new collection for scan history
finding_collection = database["findings"]  # new collection for vulnerability findings

# User helpers
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "fullname": user.get("fullname"),
        "email": user.get("email"),
        "company_name": user.get("company_name"),
        "password": user.get("password")
    }

def retrieve_users():
    users = []
    for user in user_collection.find():
        users.append(user_helper(user))
    return users

def add_user(user_data: dict) -> dict:
    result = user_collection.insert_one(user_data)
    new_user = user_collection.find_one({"_id": result.inserted_id})
    return user_helper(new_user)

def retrieve_user(id: str) -> dict | None:
    user = user_collection.find_one({"_id": ObjectId(id)})
    if user:
        return user_helper(user)
    return None

# ADD THIS MISSING FUNCTION:
def retrieve_user_by_email(email: str) -> dict | None:
    """Retrieve user by email address"""
    user = user_collection.find_one({"email": email})
    if user:
        return user_helper(user)
    return None

def update_user(id: str, data: dict) -> bool:
    if not data:
        return False
    result = user_collection.update_one({"_id": ObjectId(id)}, {"$set": data})
    return result.modified_count > 0

def delete_user(id: str) -> bool:
    result = user_collection.delete_one({"_id": ObjectId(id)})
    return result.deleted_count > 0

# Scan history helpers
def scan_helper(scan) -> dict:
    return {
        "id": str(scan["_id"]),
        "target": scan.get("target"),
        "user_id": scan.get("user_id"),
        "total_vulns": scan.get("total_vulns", 0),
        "critical": scan.get("critical", 0),
        "high": scan.get("high", 0),
        "medium": scan.get("medium", 0),
        "low": scan.get("low", 0),
        "scan_time": scan.get("scan_time", "Unknown"),
        "status": scan.get("status", "completed"),
        "date": scan.get("date", datetime.now().strftime("%Y-%m-%d")),
        "time": scan.get("time", datetime.now().strftime("%H:%M:%S")),
        "duration": scan.get("duration", "Unknown"),
        "score": scan.get("score", 0)
    }

def add_scan(scan_data: dict) -> dict:
    scan_data["created_at"] = datetime.now()
    result = scan_collection.insert_one(scan_data)
    new_scan = scan_collection.find_one({"_id": result.inserted_id})
    return scan_helper(new_scan)

def retrieve_user_scans(user_id: str) -> List[dict]:
    scans = []
    for scan in scan_collection.find({"user_id": user_id}).sort("created_at", -1):
        scans.append(scan_helper(scan))
    return scans

def retrieve_scan(scan_id: str) -> dict | None:
    scan = scan_collection.find_one({"_id": ObjectId(scan_id)})
    if scan:
        return scan_helper(scan)
    return None

# Vulnerability findings helpers
def finding_helper(finding) -> dict:
    return {
        "id": str(finding["_id"]),
        "scan_id": finding.get("scan_id"),
        "template_id": finding.get("template_id"),
        "name": finding.get("name"),
        "severity": finding.get("severity"),
        "host": finding.get("host"),
        "description": finding.get("description"),
        "matched_at": finding.get("matched_at"),
        "extracted_results": finding.get("extracted_results"),
        "curl_command": finding.get("curl_command"),
        "solution": finding.get("solution")
    }

def add_finding(finding_data: dict) -> dict:
    result = finding_collection.insert_one(finding_data)
    new_finding = finding_collection.find_one({"_id": result.inserted_id})
    return finding_helper(new_finding)

def retrieve_scan_findings(scan_id: str) -> List[dict]:
    findings = []
    for finding in finding_collection.find({"scan_id": scan_id}):
        findings.append(finding_helper(finding))
    return findings
    