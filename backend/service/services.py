import os
import jwt
from time import time
from model.models import *
from dotenv import load_dotenv
from db_config.config import conn
from fastapi import HTTPException, status, Request

load_dotenv()

def create_token(email_id):
    exp = 3600 * float(os.getenv("TOKEN_EXP"))
    encoded = jwt.encode({"email_id": email_id, "exp": int(time())+exp}, os.getenv("PRIVATE_KEY"), algorithm="HS256")
    token = Token(**{"access_token": encoded, "token_type": "bearer"})
    return token

def verify_credentials(email_id, password):
    company = conn.cursor()
    company.execute("SELECT email_id from credentials where email_id=%s and password=%s", [email_id, password])
    info = company.fetchone()
    if not info:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Email ID or Password")
    return info[0]

def check_user_exists(email_id):
    company = conn.cursor()
    company.execute("SELECT email_id from credentials where email_id=%s", [email_id])
    info = company.fetchone()
    if info:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")
    return

def add_new_user(email_id, password):
    company = conn.cursor()
    company.execute("INSERT into credentials values(%s, %s)", [email_id, password])
    conn.commit()
    return

def add_unversity(name, standing, city, country):
    company = conn.cursor()
    company.execute("INSERT into university values(%s, %s, %s, %s)", [name, standing, city, country])
    conn.commit()
    company.execute("SELECT id from university where name=?", [name])
    info = company.fetchone()
    return info[0]

def get_univeristies():
    company = conn.cursor()
    company.execute("select * from university")
    data = []
    for row in company.fetchall():
        temp = {}
        temp["id"] = row[0]
        temp["name"] = row[1]
        data.append(temp)
    return data

def add_profile(email_id, profile: Profile, path_to_resume):
    values = [
        email_id,
        profile.phone,
        profile.first_name,
        profile.middle_name,
        profile.last_name,
        profile.dob,
        profile.address_first_line,
        profile.address_second_line,
        profile.zip_code,
        profile.country,
        profile.gender,
        path_to_resume
    ]
    company = conn.cursor()
    company.execute("SELECT email_id from person where email_id=%s", [email_id])
    info = company.fetchone()
    if info:
        company.execute("""UPDATE university
                        SET phone=%s, first_name=%s, middle_name=%s, last_name=%s, 
                        dob=%s, address_first_line=%s, address_second_line=%s, zip_code=%s,
                        country=%s, gender=%s, path_to_resume=%s
                        where email_id=%s
                        """, values[1:]+[email_id])
        conn.commit()
    else:
        company.execute("""INSERT into univeristy values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""", values)
        conn.commit()
    return

def add_university(name, city, country):
    values = [name, None, city, country]
    company = conn.cursor()
    company.execute("INSERT into university values(%s, %s, %s, %s) email_id from person where email_id=%s", [values])
    conn.commit()
    return

def add_studies_at(email_id, university_id, cpi, passing_year):
    values = [
        email_id,
        university_id,
        cpi,
        passing_year
    ]
    company = conn.cursor()
    company.execute("SELECT email_id from studies_at where email_id=%s", [email_id])
    info = company.fetchone()
    if info:
        company.execute("""UPDATE studies_at
                        SET university_id=%s, cpi=%s, passing_year=%s, 
                        where email_id=%s
                        """, values[1:]+[email_id])
        conn.commit()
    else:
        company.execute("""INSERT into studies_at values(%s, %s, %s, %s)""", values)
        conn.commit()
    return

def decode_jwt(request: Request):
    token = request.headers.get('Authorization')
    try:
        assert token
        payload = jwt.decode(token, os.getenv("PRIVATE_KEY"), algorithms=["RS256"])
        email_id = payload["email_id"]
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Credentials")
    return email_id

def get_profile(email_id):
    company = conn.cursor()
    company.execute("SELECT * from person where email_id=%s", [email_id])
    info = company.fetchone()
    if not info:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile Not Found")
    return list(info)

def delete_profile(email_id):
    company = conn.cursor()
    company.execute("delete from person where email_id=%s", [email_id])
    conn.commit()
    return

def check_admin(email_id):
    try:
        parts = email_id.split('@')
        assert parts[1]=='company.com'
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Un-Authorized")
    return

def add_intern(intern: Intern):
    company = conn.cursor()
    values = list(intern.dict().values())
    try:
        company.execute("insert into intern values(%s, %s, %s, %s)", values)
        conn.commit()
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to add intern")
    return