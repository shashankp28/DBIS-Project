from model.models import *
from service.services import *
from dotenv import load_dotenv
from fastapi import APIRouter, Request, HTTPException, status, Depends

load_dotenv()

router = APIRouter()


@router.post("/intern", tags=["Admin"])
async def login(intern: Intern, email_id: str = Depends(decode_jwt)):
    check_admin(email_id)
    add_intern(intern)
    return {"message": "Intern Added Successfully"}


@router.post("/employee", tags=["Admin"])
async def register(employee: Employee, email_id: str = Depends(decode_jwt)):
    check_admin(email_id)
    add_employee(employee)
    return {"message": "Employee Added Successfully"}
