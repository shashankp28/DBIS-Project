from model.models import *
from service.services import *
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, UploadFile, File

load_dotenv()

router = APIRouter()

@router.post("/project", tags=["Employee"])
async def add_project_ep(project: Project, load = Depends(decode_jwt)):
    check_role(load, ["1", "2"])
    add_project(project)
    return {"meassge": "Project Added Successfully"}

@router.get("/project", tags=["Employee"])
async def get_project_ep(load = Depends(decode_jwt)):
    check_role(load, ["1", "2"])
    return get_project()

@router.delete("/project", tags=["Employee"])
async def delete_project_ep(project_id: str, load = Depends(decode_jwt)):
    check_role(load, ["1", "2"])
    delete_project(project_id)
    return {"meassge": "Project Deleted Successfully"}

@router.post("/assign-project", tags=["Employee"])
async def assign_project_ep(project_assign: ProjectAssign, load = Depends(decode_jwt)):
    check_role(load, ["2"])
    mentor_id = load["email_id"]
    assign_project(project_assign, mentor_id)
    return {"meassge": "Project Added Successfully"}

@router.delete("/unassign-project", tags=["Employee"])
async def unassign_project_ep(intern_id: str, load = Depends(decode_jwt)):
    check_role(load, ["2"])
    mentor_id = load["email_id"]
    unassign_project(intern_id, mentor_id)
    return {"message": "Project Un-Assigned Successfully"}

@router.get("/assigned-projects", tags=["Employee"])
async def get_assigned_projects_ep(project_id: str, load = Depends(decode_jwt)):
    check_role(load, ["1", "2", "3"])
    return get_all_interns_under_project(project_id)

@router.post("/completed", tags=["Employee"])
async def set_completed_ep(complete: Complete, load = Depends(decode_jwt)):
    check_role(load, ["2"])
    mentor_id = load["email_id"]
    return set_completed(complete, mentor_id)