from enum import Enum
from datetime import date
from typing import Optional
from pydantic import BaseModel


class Gender(str, Enum):
    male = "male"
    female = "female"
    others = "others"
    
class For(str, Enum):
    intern = "intern"
    employee = "employee"

class Login(BaseModel):
    email_id: str
    password: str
    
    
class Token(BaseModel):
    access_token: str
    token_type: str
    
class Register(BaseModel):
    email_id: str
    password: str
    confirm_password: str

class Profile(BaseModel):
    phone: str
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    dob: date
    address_first_line: str
    address_second_line: Optional[str] = None
    zip_code: int
    country: str
    gender: Gender
    university_id: int
    university_name: Optional[str] = None
    uni_city: Optional[str] = None
    uni_country: Optional[str] = None
    cpi: float
    passing_year: int
    applied_for: For

class Intern(BaseModel):
    email_id: str
    stipend: Optional[int] = None
    start_date: date
    expected_end_date: date
    location_id: str

class Employee(BaseModel):
    email_id: str
    salary: int
    location_id: str
    
class Assign(BaseModel):
    mentor_id: str
    intern_id: str
    
class Project(BaseModel):
    project_id: str
    topic: str
    description: str
    
class ProjectAssign(BaseModel):
    intern_id: str
    project_id: str
    assigned_date: str
    end_date: Optional[str] = None
    
class Complete(BaseModel):
    email_id: str
    end_date: date
    score: int
    performance_desc: Optional[str] = None