from model.models import *
from service.services import *
from dotenv import load_dotenv
from fastapi import APIRouter, Request, HTTPException, status, Depends

load_dotenv()

router = APIRouter()

@router.get("/intern", tags=["Admin"])
async def get_intern_ep(load: str = Depends(decode_jwt)):
    check_role(load, ["1"])
    return get_interns()

@router.post("/intern", tags=["Admin"])
async def add_intern_ep(intern: Intern, load: str = Depends(decode_jwt)):
    check_role(load, ["1"])
    add_intern(intern)
    return {"message": "Intern Added Successfully"}

@router.delete("/intern", tags=["Admin"])
async def delete_intern_ep(email_id: str, load: str = Depends(decode_jwt)):
    check_role(load, ["1"])
    delete_intern(email_id)
    return {"message": "Intern Deleted Successfully"}

@router.get("/employee", tags=["Admin"])
async def get_employee_ep(load: str = Depends(decode_jwt)):
    check_role(load, ["1"])
    return get_employees()

@router.post("/employee", tags=["Admin"])
async def add_employee_ep(employee: Employee, load: str = Depends(decode_jwt)):
    check_role(load, ["1"])
    add_employee(employee)
    return {"message": "Employee Added Successfully"}

@router.delete("/employee", tags=["Admin"])
async def delete_employee_ep(employee: Employee, load: str = Depends(decode_jwt)):
    check_role(load, ["1"])
    delete_employee(employee)
    return {"message": "Employee Deleted Successfully"}