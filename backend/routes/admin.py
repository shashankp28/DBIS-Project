from model.models import *
from service.services import *
from dotenv import load_dotenv
from fastapi import APIRouter, Request, HTTPException, status, Depends

load_dotenv()

router = APIRouter()


@router.post("/intern", tags=["Admin"], response_model=Token)
async def login(intern: Intern, email_id: str = Depends(decode_jwt)):
    check_admin(email_id)
    add_intern(intern)
    return create_token(email_id)


@router.post("/register", tags=["Admin"], response_model=Token)
async def register(register: Register):
    if register.password!=register.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")
    check_user_exists(register.email_id)
    add_new_user(register.email_id, register.password)
    return create_token(register.email_id)
