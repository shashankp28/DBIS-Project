from model.models import *
from service.services import *
from dotenv import load_dotenv
from fastapi import APIRouter, Request, HTTPException, status

load_dotenv()

router = APIRouter()


@router.get("/", tags=["General"])
async def home(req: Request):
    return {"Hello": "World", "client": req.client.host}


@router.post("/login", tags=["General"], response_model=Token)
async def login(credentials: Login):
    email_id = verify_credentials(credentials.email_id, credentials.password)
    return create_token(email_id)


@router.post("/register", tags=["General"], response_model=Token)
async def register(register: Register):
    if register.password!=register.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")
    check_user_exists(register.email_id)
    add_new_user(register.email_id, register.password)
    return create_token(register.email_id)
