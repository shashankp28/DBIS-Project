from model.models import *
from service.services import *
from dotenv import load_dotenv
from fastapi import APIRouter, Depends

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
async def delete_employee_ep(email_id: str, load: str = Depends(decode_jwt)):
    check_role(load, ["1"])
    delete_employee(email_id)
    return {"message": "Employee Deleted Successfully"}

@router.get("/unassigned-intern", tags=["Admin"])
async def unassigned_intern_ep(load: str = Depends(decode_jwt)):
    check_role(load, ["1"])
    return unassigned('intern')

@router.get("/unassigned-employee", tags=["Admin"])
async def unassigned_employee_ep(load: str = Depends(decode_jwt)):
    check_role(load, ["1"])
    return unassigned('employee')

@router.get("/mentor", tags=["Admin"])
async def get_mentors_ep(load: str = Depends(decode_jwt)):
    check_role(load, ["1"])
    return get_mentor_data()

@router.post("/mentor", tags=["Admin"])
async def assign_mentor_ep(assign: Assign, load: str = Depends(decode_jwt)):
    check_role(load, ["1"])
    assign_mentor(assign)
    return {"message": "Mentor Assigned Successfully"}

# @router.delete("/mentor", tags=["Admin"])
# async def unassign_mentor_ep(email_id: str, load: str = Depends(decode_jwt)):
#     check_role(load, ["1"])
#     unassign_mentor(email_id)
#     return {"message": "Mentor Un-Assigned Successfully"}

@router.get("/completed", tags=["Admin"])
async def get_completed_info_ep(load: str = Depends(decode_jwt)):
    check_role(load, ["1"])
    return get_completed_info()

@router.get("/get-by-location", tags=["Admin"])
async def get_details_at_location_ep(location_id: str, load: str = Depends(decode_jwt)):
    check_role(load, ["1"])
    return get_details_at_location(location_id)

