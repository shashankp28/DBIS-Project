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
    exp = 3600 * float(os.getenv("TOKEN_EXP")) * 24
    try: company.execute("SELECT role_id from has_role where email_id=%s", [email_id])
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info = company.fetchone()
    try: info = info[0]
    except Exception as e:
        print(e) 
        info = "Null"
    encoded = jwt.encode({"email_id": email_id, "role": info, "exp": int(time())+exp}, os.getenv("PRIVATE_KEY"), algorithm="HS256")
    token = Token(**{"access_token": encoded, "token_type": "Bearer"})
    return token

def verify_credentials(email_id, password):
    company = conn.cursor()
    try: company.execute("SELECT email_id from credentials where email_id=%s and password=%s", [email_id, password])
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info = company.fetchone()
    if not info:
        company.close()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Email ID or Password")
    company.close()
    return info[0]

def check_user_exists(email_id):
    company = conn.cursor()
    try: company.execute("SELECT email_id from credentials where email_id=%s", [email_id])
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info = company.fetchone()
    if info:
        
        company.close()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")
    company.close()
    return

def add_new_user(email_id, password):
    company = conn.cursor()
    try: company.execute("INSERT into credentials values(%s, %s)", [email_id, password])
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    conn.commit()
    company.close()
    return

def add_unversity(name, standing, city, country):
    company = conn.cursor()
    try: company.execute("INSERT into university values(%s, %s, %s, %s)", [name, standing, city, country])
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    conn.commit()
    try: company.execute("SELECT id from university where name=?", [name])
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info = company.fetchone()
    company.close()
    return info[0]

def get_univeristies():
    company = conn.cursor()
    try: company.execute("select * from university")
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
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
        path_to_resume,
        profile.applied_for
    ]
    company = conn.cursor(buffered=True)
    try: company.execute("SELECT email_id from person where email_id=%s", [email_id])
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    
    info = company.fetchone()
    if info:
        try: company.execute("""UPDATE person
                        SET phone=%s, first_name=%s, middle_name=%s, last_name=%s, 
                        dob=%s, address_first_line=%s, address_second_line=%s, zip_code=%s,
                        country=%s, gender=%s, path_to_resume=%s, applied_for=%s
                        where email_id=%s
                        """, values[1:]+[email_id])
        except Exception as e:
            print(e) 
            company.close()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
        conn.commit()
    else:
        try: company.execute("""INSERT into person values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""", values)
        except Exception as e:
            print(e) 
            company.close()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
        conn.commit()
    company.close()
    return

def add_university(name, city, country):
    values = [name, None, city, country]
    company = conn.cursor(buffered=True)
    try: company.execute("INSERT into university(name, standing, city, country) values(%s, %s, %s, %s)", values)
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    conn.commit()
    try: company.execute("select id from university where name=%s", [values[0]])
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
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
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info = company.fetchone()
    if info:
        try: company.execute("""UPDATE studies_at
                        SET university_id=%s, cpi=%s, passing_year=%s
                        where email_id=%s
                        """, values[1:]+[email_id])
        except Exception as e:
            print(e) 
            company.close()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
        conn.commit()
    else:
        try: company.execute("""INSERT into studies_at values(%s, %s, %s, %s)""", values)
        except Exception as e:
            print(e) 
            company.close()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
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
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Credentials")
    return {"email_id": email_id, "role": role}

def get_profile(email_id):
    company = conn.cursor()
    try: company.execute("SELECT * from person where email_id=%s", [email_id])
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info = company.fetchone()
    if not info:
        company.close()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile Not Found")
    try: company.execute("SELECT * from studies_at where email_id=%s", [email_id])
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    info_u = company.fetchone()
    data = {
        "email_id": info[0],
        "phone": info[1],
        "first_name": info[2],
        "middle_name": info[3],
        "last_name": info[4],
        "dob": info[5],
        "address_first_line": info[6],
        "address_second_line": info[7],
        "zip_code": info[8],
        "country": info[9],
        "gender": info[10],
        "path_to_resume": info[11],
        "applied_for": info[12],
        "university_id": info_u[1],
        "cpi": info_u[2],
        "passing_year": info_u[3]
    }
    company.close()
    return data

def delete_profile(email_id):
    company = conn.cursor()
    try: 
        company.execute("delete from person where email_id=%s", [email_id])
        conn.commit()
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    company.close()
    return

def set_location(email_id, location_id):
    company = conn.cursor()
    err = False
    try: 
        try: company.execute("insert into at_location values(%s, %s)", [email_id, location_id])
        except Exception as e:
            print(e) 
            try: company.execute("update at_location set location_id=%s where email_id=%s", [location_id, email_id])
            except Exception as e: 
                print(e) 
                company.close()
                err = True
        conn.commit()
    except Exception as e:
        print(e) 
        company.close()
        err = True
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    company.close()
    return

def check_role(load, roles):
    try:
        assert load["role"] in roles
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Un-Authorized")
    return

def add_intern(intern: Intern):
    err = False
    company = conn.cursor()
    temp_dict = intern.dict()
    del temp_dict["location_id"]
    values = list(temp_dict.values())
    try:
        assign_role(intern.email_id, 3)
        set_location(intern.email_id, intern.location_id)
        try: company.execute("insert into intern values(%s, %s, %s, %s)", values)
        except Exception as e:
            try: company.execute("""upadte intern
                                 set stipend=%s, start_date=%s, end_date=%s
                                 where email_id=%s""", values[1:]+[values[0]])
            except Exception as e:
                print(e) 
                company.close()
                err = True
        conn.commit()
    except Exception as e:
        print(e)
        company.close()
        err = True
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to add intern")
    company.close()
    return

def add_employee(employee: Employee):
    err = False
    company = conn.cursor()
    temp_dict = employee.dict()
    del temp_dict["location_id"]
    values = list(temp_dict.values())
    try:
        assign_role(employee.email_id, 2)
        set_location(employee.email_id, employee.location_id)
        try: company.execute("insert into employee values(%s, %s)", values)
        except Exception as e:
            print(e) 
            try: company.execute("""update employee 
                                 set salary=%s
                                 where email_id=%s""", [employee.salary, employee.email_id])
            except Exception as e:
                print(e) 
                company.close()
                err = True
        conn.commit()
    except Exception as e:
        print(e)
        company.close()
        err = True
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to add employee")
    company.close()
    return

def delete_intern(email_id: str):
    err = False
    company = conn.cursor()
    try:
        unassign_roles(email_id)
        try: company.execute("delete from intern where email_id=%s", [email_id])
        except Exception as e:
            print(e) 
            company.close()
            err = True
        conn.commit()
    except Exception as e:
        print(e)
        err = True
        company.close()
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to delete intern")
    company.close()
    return

def delete_employee(email_id: str):
    err = False
    company = conn.cursor()
    try:
        try: company.execute("delete from employee where email_id=%s", [email_id])
        except Exception as e:
            print(e) 
            company.close()
            err = True
        unassign_roles(email_id)
        conn.commit()
    except Exception as e:
        print(e)
        err = True
        company.close()
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to delete employee")
    company.close()
    return

def assign_role(email_id, role_id):
    company = conn.cursor()
    err = False
    try: 
        try: company.execute("insert into has_role values(%s, %s)", [email_id, role_id])
        except Exception as e:
            print(e) 
            try: company.execute("update has_role set role_id=%s where email_id=%s", [role_id, email_id])
            except Exception as e:
                print(e) 
                company.close()
                err = True
        conn.commit()
    except Exception as e:
        print(e) 
        company.close()
        err = True
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    company.close()
    return

def unassign_roles(email_id):
    company = conn.cursor()
    try: 
        company.execute("delete from has_role where email_id=%s", [email_id])
        conn.commit()
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    company.close()
    return

def get_interns():
    company = conn.cursor()
    data = []
    err = False
    try:
        try: company.execute("select * from intern")
        except Exception as e:
            print(e) 
            company.close()
            err = True
        info = company.fetchall()
        for inf in info:
            details = get_profile(inf[0])
            del details["email_id"]
            temp_data = {"email_id": inf[0], "stipend": inf[1], "start_date": inf[2], "expected_end_date": inf[3], "details": details}
            try: company.execute("select mentor_id from is_mentor where intern_id=%s", [inf[0]])
            except Exception as e:
                print(e) 
                company.close()
                err = True
            temp_inf = company.fetchone()
            temp_data["assigned_to_mentor"] = temp_inf if not temp_inf else temp_inf[0]
            data.append(temp_data)
    except Exception as e:
        print(e)
        company.close()
        err = True
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get intern")
    company.close()
    return data

def get_employees():
    company = conn.cursor()
    data = []
    err = False
    try:
        try: company.execute("select * from employee")
        except Exception as e:
            print(e) 
            company.close()
            err = True
        info = company.fetchall()
        for inf in info:
            details = get_profile(inf[0])
            del details["email_id"]
            temp_data = {"email_id": inf[0], "salary": inf[1], "details": details}
            try: company.execute("select intern_id from is_mentor where mentor_id=%s", [inf[0]])
            except Exception as e:
                print(e) 
                company.close()
                err = True
            temp_data["mentor_is_assigned"] = list(company.fetchall())
            data.append(temp_data)
    except Exception as e:
        print(e)
        company.close()
        err = True
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get employy")
    company.close()
    return data

def unassigned(which):
    err = False
    company = conn.cursor()
    data = []
    try:
        try: company.execute(f"""select P.email_id
                                from person P
                                where email_id not in (
                                    select W.email_id
                                    from {which} W
                                    ) and P.applied_for='{which}'""")
        except Exception as e:
            print(e) 
            company.close()
            err = True
        info = company.fetchall()
        for inf in info: data.append(get_profile(inf[0]))
    except Exception as e:
        print(e)
        company.close()
        err = True
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get data")
    company.close()
    return data

def assign_mentor(assign: Assign):
    err = False
    company = conn.cursor()
    values = [assign.intern_id, assign.mentor_id]
    try:
        try: company.execute("insert into is_mentor values(%s, %s)", values)
        except Exception as e:
            print(e)
            try: company.execute("update is_mentor set intern_id=%s where mentor_id=%s", [values[1], values[0]])
            except:
                company.close()
                err = True
        conn.commit()
    except Exception as e:
        print(e)
        company.close()
        err = True
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to assign mentor")
    company.close()
    return

def unassign_mentor(email_id):
    err = False
    company = conn.cursor()
    values = [email_id]
    try:
        try: company.execute("delete from is_mentor where mentor_id=%s", values)
        except Exception as e:
            print(e) 
            company.close()
            err = True
        conn.commit()
    except Exception as e:
        print(e)
        company.close()
        err = True
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to unassign mentor")
    company.close()
    return

def get_mentor_data():
    err = False
    company = conn.cursor()
    data = []
    try:
        try: company.execute("select * from is_mentor")
        except Exception as e:
            print(e) 
            company.close()
            err = True
        info = company.fetchall()
        for inf in info:
            temp_info_intern = get_profile(inf[0])
            temp_info_mentor = get_profile(inf[1])
            temp_data = {"intern": {
                    "email_id": temp_info_intern["email_id"],
                    "first_name": temp_info_intern["first_name"],
                    "last_name": temp_info_intern["last_name"],
                    "phone": temp_info_intern["phone"]
                },
                "mentor":{
                    "email_id": temp_info_mentor["email_id"],
                    "first_name": temp_info_mentor["first_name"],
                    "last_name": temp_info_mentor["last_name"],
                    "phone": temp_info_mentor["phone"]
                } 
            }
            data.append(temp_data)
    except Exception as e:
        print(e)
        company.close()
        err = True
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get mentors")
    company.close()
    return data

def add_project(project: Project):
    err = False
    company = conn.cursor()
    values = [
        project.project_id,
        project.topic,
        project.description,
    ]
    try:
        try: company.execute("insert into project values(%s, %s, %s)", values)
        except Exception as e:
            print(e) 
            try: company.execute("""update project
                                 set topic=%s, description=%s
                                 where project_id=%s""", values[1:]+[values[0]])
            except Exception as e:
                print(e) 
                company.close()
                err = True
        conn.commit()
    except Exception as e:
        print(e)
        company.close()
        err = True
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to add project")
    company.close()
    return

def get_project():
    err = False
    company = conn.cursor()
    data = []
    try:
        try: company.execute("select * from project")
        except Exception as e:
            print(e) 
            company.close()
            err = True
        info = company.fetchall()
        for inf in info:
            temp_data = {"project_id": inf[0], "topic": inf[1], "description": inf[2]}
            data.append(temp_data)
    except Exception as e:
        print(e)
        company.close()
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get project")
    company.close()
    return data

def delete_project(project_id):
    company = conn.cursor()
    try: 
        company.execute("delete from project where project_id=%s", [project_id])
        conn.commit()
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database Error")
    company.close()
    return

def assign_project(project_assign: ProjectAssign, mentor_id: str):
    err = False
    company = conn.cursor()
    values = [
        project_assign.intern_id,
        project_assign.project_id,
        project_assign.assigned_date,
        project_assign.end_date
    ]
    try: 
        company.execute("""select mentor_id 
                        from is_mentor 
                        where mentor_id=%s and intern_id=%s""", [mentor_id, project_assign.intern_id])
        info = company.fetchone()
        assert info is not None
        try: company.execute("insert into assigned_to value(%s, %s, %s, %s)", values)
        except Exception as e:
            print(e) 
            try: company.execute("""update assigned_to
                                 set project_id=%s, assigned_date=%s, end_date=%s
                                 where email_id=%s""", values[1:]+[values[0]])
            except Exception as e:
                print(e)
                err = True
        conn.commit()
    except Exception as e:
        print(e) 
        company.close()
        err = True
    if err: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to assign project")
    company.close()
    return

def unassign_project(intern_id: str, mentor_id: str):
    company = conn.cursor()
    try: 
        company.execute("""select mentor_id 
                        from is_mentor 
                        where mentor_id=%s and intern_id=%s""", [mentor_id, intern_id])
        info = company.fetchone()
        assert info is not None
        company.execute("delete from assigned_to where email_id=%s", [intern_id])
        conn.commit()
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to unassign project")
    company.close()
    return

def get_all_interns_under_project(project_id):
    company = conn.cursor()
    data = []
    try: 
        company.execute("""select email_id
                        from assigned_to
                        where project_id=%s""", [project_id])
        info = company.fetchall()
        for inf in info:
            data.append(get_profile(inf[0]))
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get assigned project")
    company.close()
    return data

def get_locations():
    company = conn.cursor()
    data = []
    try: 
        company.execute("""select * from location""")
        info = company.fetchall()
        for inf in info:
            temp_data = {"location_id": inf[0], "address": inf[1], "city": inf[2], "country": inf[3]}
            data.append(temp_data)
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get locations")
    company.close()
    return data

def set_completed(complete: Complete, mentor_id: str):
    company = conn.cursor()
    data = [
        complete.email_id,
        complete.end_date,
        complete.score,
        complete.performance_desc
    ]
    try: 
        company.execute("""insert into is_completed
                        values(%s, %s, %s, %s)""", data)
        unassign_roles(complete.email_id)
        conn.commit()
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to complete intern")
    company.close()
    return

def get_completed_info():
    company = conn.cursor()
    data = []
    try: 
        company.execute("""select * from is_completed""")
        info = company.fetchall()
        for inf in info:
            temp_data = {"email_id": inf[0], "end_date": inf[1], "score": inf[2], "performance_desc": inf[3]}
            temp_data["details"] = get_profile(inf[0])
            data.append(temp_data)
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get completed")
    company.close()
    return data

def get_details_at_location(location_id):
    company = conn.cursor()
    data = []
    try: 
        company.execute("""select email_id from at_location where location_id=%s""", [location_id])
        info = company.fetchall()
        for inf in info:
            data.append(get_profile(inf[0]))
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get completed")
    company.close()
    return data

def get_my_interns(mentor_id):
    company = conn.cursor()
    data = []
    try: 
        company.execute("""select intern_id from is_mentor where mentor_id=%s""", [mentor_id])
        info = company.fetchall()
        for inf in info:
            data.append(get_profile(inf[0]))
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get my interns")
    company.close()
    return data

def get_mentor_by_student(intern_id):
    company = conn.cursor()
    try: 
        company.execute("""select mentor_id from is_mentor where intern_id=%s""", [intern_id])
        info = company.fetchone()
        assert info is not None
    except Exception as e:
        print(e) 
        company.close()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Failed to get mentor by student")
    company.close()
    return get_profile(info[0])