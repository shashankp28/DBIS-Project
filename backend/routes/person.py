import os
from datetime import date
from model.models import *
from service.services import *
from dotenv import load_dotenv
from fastapi import APIRouter, File, HTTPException, status, Depends, UploadFile
from fastapi.responses import FileResponse


load_dotenv()

router = APIRouter()

@router.post("/upload-resume", tags=["Person"])
async def upload_file_ep(file: UploadFile = File(...), load = Depends(decode_jwt)):
    try:
        contents = file.file.read()
        with open("resume/"+load["email_id"]+".pdf", 'wb') as f:
            f.write(contents)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File Error")
    return {"meassge": "File Upload Success"}

@router.post("/profile", tags=["Person"])
async def add_profile_ep(profile: Profile, load = Depends(decode_jwt)):
    uni_id = profile.university_id
    today = date.today()
    age = today.year - profile.dob.year - ((today.month, today.day) < (profile.dob.month, profile.dob.day))
    if(age<18): raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="We Dont do Child Labour")
    if uni_id==1:
        if not all([profile.university_name, profile.uni_city, profile.uni_country]):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="University Information Missing")
        else:
            uni_id = add_university(profile.university_name, profile.uni_city, profile.uni_country)
    add_profile_to_db(load["email_id"], profile, load["email_id"]+".pdf")
    add_studies_at(load["email_id"], uni_id, profile.cpi, profile.passing_year)
    return {"meassge": "Profile Updated Successfully"}

@router.get("/profile", tags=["Person"])
async def get_profile_ep(load = Depends(decode_jwt)):
    return get_profile(load["email_id"])

@router.get("/profile-by-id", tags=["Person"])
async def get_profile_ep(email_id: str):
    return get_profile(email_id)

@router.delete("/profile", tags=["Person"])
async def delete_profile_ep(load = Depends(decode_jwt)):
    delete_profile(load["email_id"])
    return {"message": "Profile Deleted Successfully"}

@router.get("/resume", tags=["Person"])
async def get_resume_ep(path_to_resume, load=Depends(decode_jwt)):
    path = "resume/"+path_to_resume
    if os.path.exists(path):
        return FileResponse(path, media_type="application/pdf")
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume Not Found")
    
@router.get("/mentor-by-student", tags=["Person"])
async def get_mentor_by_student_ep(intern_id: str, load=Depends(decode_jwt)):
    return get_mentor_by_student(intern_id)