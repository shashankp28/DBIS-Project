from model.models import *
from service.services import *
from dotenv import load_dotenv
from fastapi import APIRouter, File, Request, HTTPException, status

load_dotenv()

router = APIRouter()


@router.get("/university", tags=["University"])
async def all_universities():
    return get_univeristies()