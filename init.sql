create table person(
    email_id varchar(50) not null,
    phone varchar(15) not null unique,
    first_name varchar(30) not null,
    middle_name varchar(30),
    last_name varchar(30),
    dob DATE check(DATEDIFF(year, dob, getdate())>18) not null ,
    address_first_line varchar(50) not null,
    address_second_line varchar(50),
    zip_code int not null check(zip),
    country varchar(25) not null,
    gender ENUM('male', 'female', 'others'),
    path_to_resume varchar(100) not null,
    primary key (email_id)
);

create table employee(
    email_id varchar(50) not null,
    salary int not null check(salary>0),
    position varchar(30) not null,
    role_id varchar(10) not null,
    primary key email_id,
    foreign key email_id references person,
    foreign key role_id references role(id)
);

create table stage(
    stage_id int not null,
    description varchar(50) not null,
    primary key stage_id
);

create table applicant(
    email_id varchar(50) not null,
    interviewer_id varchar(50),
    schedule date,
    stage_id int not null,
    primary key email_id,
    foreign key email_id references person,
    foreign key interviewer_id references employee(email_id),
    foreign key stage_id references stage
);

create table intern(
    email_id varchar(50) not null,
    stipend int check(stipend>0),
    mentor_id varchar(50) not null,
    position varchar(30) not null,
    role_id varchar(10) not null,
    start_date DATE not null,
    expected_end_date DATE not null,
    -- current_status BOOLEAN not null,
    primary key email_id,
    foreign key mentor_id references employee(email_id),
    foreign key email_id references person,
    foreign key role_id references role(id)
);

create table is_completed(
    email_id varchar(50) not null,
    actual_end_date DATE not null,
    score int not null check(score>=0 and score<=10),
    performance_desc varchar(1000),
    primary key email_id,
    foreign key email_id references intern(email_id)
);

-- create table has_role(

-- )

create table role(
    id varchar(10) not null,
    name varchar(100) not null,
    description varchar(1000) not null,
    primary key id
);

-- create table previous_interns(
--     email_id varchar(50) not null,
--     stipend int check(stipend>0),
--     mentor_id varchar(50) not null,
--     position varchar(30) not null,
--     role_id varchar(10) not null,
--     primary key email_id,
--     foreign key mentor_id references employee(email_id),
--     foreign key email_id references person,
--     foreign key role_id references role(id)
-- );