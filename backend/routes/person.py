from model.models import *
from service.services import *
from dotenv import load_dotenv
from fastapi import APIRouter, File, Request, HTTPException, status, Depends, UploadFile

load_dotenv()

router = APIRouter()

@router.post("/uploadfile", tags=["Person"])
async def add_profile(file: UploadFile = File(...)):
    try:
        contents = file.file.read()
        with open(file.filename, 'wb') as f:
            f.write(contents)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File Error")
    return {"meassge": "File Upload Success"}

@router.post("/profile", tags=["Person"])
async def add_profile(profile: Profile, file: UploadFile = File(...), email_id: str = Depends(decode_jwt)):
    uni_id = profile.university_id
    try:
        contents = file.file.read()
        with open("resume/"+email_id+".pdf", 'wb') as f:
            f.write(contents)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File Error")
    if uni_id==1:
        if not all([profile.university_name, profile.uni_city, profile.uni_country]):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="University Information Missing")
        else:
            uni_id = add_university(profile.university_name, profile.uni_city, profile.uni_country)
    add_profile(profile, email_id, email_id+".pdf")
    add_studies_at(email_id, uni_id, profile.cpi, profile.passing_year)
    return {"meassge": "Profile Updated Successfully"}

@router.get("/profile", tags=["Person"])
async def add_profile(email_id: str = Depends(decode_jwt)):
    return get_profile(email_id)

@router.delete("/profile", tags=["Person"])
async def add_profile(email_id: str = Depends(decode_jwt)):
    delete_profile(email_id)
    return {"message": "Profile Deleted Successfully"}