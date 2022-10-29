import os
import jwt
from time import time
from model.models import *
from dotenv import load_dotenv
from db_config.config import conn
from fastapi import HTTPException, status, Request

load_dotenv()

def create_token(email_id):
    company = conn.cursor()
    exp = 3600 * float(os.getenv("TOKEN_EXP"))
    try: company.execute("SELECT role_id from has_role where email_id=%s", [email_id])
    except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info = company.fetchone()
    try: info = info[0]
    except: info = "Null"
    encoded = jwt.encode({"email_id": email_id, "role": info,"exp": int(time())+exp}, os.getenv("PRIVATE_KEY"), algorithm="HS256")
    token = Token(**{"access_token": encoded, "token_type": "Bearer"})
    return token

def verify_credentials(email_id, password):
    company = conn.cursor()
    try: company.execute("SELECT email_id from credentials where email_id=%s and password=%s", [email_id, password])
    except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info = company.fetchone()
    if not info:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Email ID or Password")
    company.close()
    return info[0]

def check_user_exists(email_id):
    company = conn.cursor()
    try: company.execute("SELECT email_id from credentials where email_id=%s", [email_id])
    except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info = company.fetchone()
    if info:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")
    company.close()
    return

def add_new_user(email_id, password):
    company = conn.cursor()
    try: company.execute("INSERT into credentials values(%s, %s)", [email_id, password])
    except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    conn.commit()
    company.close()
    return

def add_unversity(name, standing, city, country):
    company = conn.cursor()
    try: company.execute("INSERT into university values(%s, %s, %s, %s)", [name, standing, city, country])
    except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    conn.commit()
    try: company.execute("SELECT id from university where name=?", [name])
    except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info = company.fetchone()
    company.close()
    return info[0]

def get_univeristies():
    company = conn.cursor()
    try: company.execute("select * from university")
    except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    data = []
    for row in company.fetchall():
        temp = {}
        temp["id"] = row[0]
        temp["name"] = row[1]
        data.append(temp)
    company.close()
    return data

def add_profile_to_db(email_id, profile: Profile, path_to_resume):
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
    company = conn.cursor(buffered=True)
    try: company.execute("SELECT email_id from person where email_id=%s", [email_id])
    except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    
    info = company.fetchone()
    if info:
        try: company.execute("""UPDATE person
                        SET phone=%s, first_name=%s, middle_name=%s, last_name=%s, 
                        dob=%s, address_first_line=%s, address_second_line=%s, zip_code=%s,
                        country=%s, gender=%s, path_to_resume=%s
                        where email_id=%s
                        """, values[1:]+[email_id])
        except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
        conn.commit()
    else:
        try: company.execute("""INSERT into person values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""", values)
        except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
        conn.commit()
    company.close()
    return

def add_university(name, city, country):
    values = [name, None, city, country]
    company = conn.cursor(buffered=True)
    try: company.execute("INSERT into university(name, standing, city, country) values(%s, %s, %s, %s)", values)
    except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    conn.commit()
    try: company.execute("select id from university where name=%s", [values[0]])
    except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info = company.fetchone()
    company.close()
    return info[0]

def add_studies_at(email_id, university_id, cpi, passing_year):
    values = [
        email_id,
        university_id,
        cpi,
        passing_year
    ]
    company = conn.cursor()
    try: company.execute("SELECT email_id from studies_at where email_id=%s", [email_id])
    except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info = company.fetchone()
    if info:
        try: company.execute("""UPDATE studies_at
                        SET university_id=%s, cpi=%s, passing_year=%s
                        where email_id=%s
                        """, values[1:]+[email_id])
        except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
        conn.commit()
    else:
        try: company.execute("""INSERT into studies_at values(%s, %s, %s, %s)""", values)
        except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
        conn.commit()
    company.close()
    return

def decode_jwt(request: Request):
    token = request.headers.get('Credentials')
    try:
        assert token
        tokens = token.split()
        assert tokens[0]=="Bearer"
        payload = jwt.decode(tokens[1], os.getenv("PRIVATE_KEY"), algorithms=["HS256"])
        email_id = payload["email_id"]
        role = payload["role"]
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Credentials")
    return {"email_id": email_id, "role": role}

def get_profile(email_id):
    company = conn.cursor()
    try: company.execute("SELECT * from person where email_id=%s", [email_id])
    except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info = company.fetchone()
    if not info:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile Not Found")
    company.close()
    return list(info)

def delete_profile(email_id):
    company = conn.cursor()
    try: company.execute("delete from person where email_id=%s", [email_id])
    except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    conn.commit()
    company.close()
    return

def check_role(load, roles):
    try:
        assert load["role"] in roles
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Un-Authorized")
    return

def add_intern(intern: Intern):
    company = conn.cursor()
    values = list(intern.dict().values())
    try:
        try: company.execute("insert into intern values(%s, %s, %s, %s)", values)
        except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
        conn.commit()
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to add intern")
    company.close()
    return

def add_employee(employee: Employee):
    company = conn.cursor()
    values = list(employee.dict().values())
    try:
        try: company.execute("insert into employee values(%s, %s)", values)
        except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
        conn.commit()
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to add employee")
    company.close()
    return

def delete_intern(email_id: str):
    company = conn.cursor()
    try:
        try: company.execute("delete from intern where email_id=%s", [email_id])
        except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
        conn.commit()
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to delete intern")
    company.close()
    return

def delete_employee(email_id: str):
    company = conn.cursor()
    try:
        try: company.execute("delete from employee where email_id=%s", [email_id])
        except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
        conn.commit()
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to delete employee")
    company.close()
    return

def get_interns():
    company = conn.cursor()
    data = []
    try:
        try: company.execute("select * from intern")
        except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
        info = company.fetchall()
        for inf in info:
            temp_data = {"email_id": inf[0], "stipend": inf[1], "start_date": inf[2], "expected_end_date": inf[3]}
            try: company.execute("select mentor_id from is_mentor where intern_id=%s", [inf[0]])
            except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
            temp_inf = company.fetchone()
            temp_data["assigned_to"] = temp_inf if not temp_inf else temp_inf[0]
            data.append(temp_data)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get intern")
    company.close()
    return data

def get_employees():
    company = conn.cursor()
    data = []
    try:
        try: company.execute("select * from employee")
        except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
        info = company.fetchall()
        for inf in info:
            temp_data = {"email_id": inf[0], "salary": inf[1]}
            try: company.execute("select intern_id from is_mentor where mentor_id=%s", [inf[0]])
            except: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
            temp_data["is_assigned"] = list(company.fetchall())
            data.append(temp_data)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get intern")
    company.close()
    return data