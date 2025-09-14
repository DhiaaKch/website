from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime



class PostSchema(BaseModel):
    id: int = Field(default=None)
    title: str = Field(...)
    content: str = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Dashboard.",
                "content": "Scan Statistics"
            }
        }
class UserSchema(BaseModel):
    id: int = Field(default=None)
    fullname: str = Field(...)
    companyname: str = Field(...)
    email: str = Field(...)
    password: str = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "fullname": "Abdulazeez Abdulazeez Adeshina",
                "companyname": "Tesla",
                "email": "abulazee@x.com"
            }
        }    

class UserSignupSchema(BaseModel):
    fullname: str = Field(...)
    companyname: str = Field(...)
    email: EmailStr = Field(...) 
    password: str = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "fullname": "Abdulazeez Abdulazeez Adeshina",
                "companyname": "Tesla",
                "email": "abdulazeez@x.com",
                "password": "Secure@123"
            }
        }

class UserLoginSchema(BaseModel):
    email: str = Field(...)
    password: str = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "email": "abdulazeez@x.com",
                "password": "weakpassword"
            }
        }
class ScanResultSchema(BaseModel):
    user_email: str
    scan_id: str
    target_url: str
    scan_date: datetime
    status: str  
    found_vulnerabilities: List[str]

class VulnerabilitySchema(BaseModel):
    scan_id: str
    vulnerability_id: str
    description: str
    severity: str 
    recommendation: str
    fixed: bool = False

class ScanHistorySchema(BaseModel):
    user_email: str
    history_id: str
    scan_id: str
    scan_date: datetime
    result_summary: Optional[str] = None

class StatisticsSchema(BaseModel):
    user_email: str
    total_scans: int
    total_vulnerabilities: int
    fixed_vulnerabilities: int
    last_scan_date: Optional[datetime]

class ScanResult(BaseModel):
    template_id: Optional[str] = None
    name: Optional[str] = None
    severity: Optional[str] = None
    host: Optional[str] = None
    description: Optional[str] = None
    matched_at: Optional[str] = None
    extracted_results: Optional[List[str]] = None
    curl_command: Optional[str] = None
    solution: Optional[str] = None

class ScanRequest(BaseModel):
    target: str
    user_email: str
