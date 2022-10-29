create database company;
use company;

create table credentials(
    email_id varchar(50) not null,
    password varchar(100) not null,
    primary key (email_id)
);

create table role(
    id varchar(10) not null,
    name varchar(100) not null,
    description varchar(1000) not null,
    primary key (id)
);

create table location(
    location_id varchar(10) not null,
    address varchar(50) not null,
    city varchar(30) not null,
    country varchar(30) not null,
    primary key (location_id)
);

create table project(
    project_id varchar(10) not null,
    topic varchar(100) not null,
    description varchar(1000) not null,
    path_to_pdf varchar(200) not null,
    primary key (project_id)
);

create table university(
    id int not null auto_increment,
    name varchar(100) not null,
    standing int check(standing > 0),
    city varchar(30) not null,
    country varchar(30) not null,
    primary key (id)
);

create table person(
    email_id varchar(50) not null,
    phone varchar(15) not null unique,
    first_name varchar(30) not null,
    middle_name varchar(30),
    last_name varchar(30),
    dob DATE not null ,
    address_first_line varchar(50) not null,
    address_second_line varchar(50),
    zip_code int not null check(zip_code>0),
    country varchar(25) not null,
    gender ENUM('male', 'female', 'others'),
    path_to_resume varchar(100) not null,
    primary key (email_id),
    foreign key (email_id) references credentials(email_id) on delete cascade on update cascade
);

create table employee(
    email_id varchar(50) not null,
    salary int not null check(salary>0),
    -- position varchar(30) not null,
    -- role_id varchar(10) not null,
    primary key (email_id),
    foreign key (email_id) references person(email_id) on delete cascade on update cascade
    -- foreign key role_id references role(id)
);
create table intern(
    email_id varchar(50) not null,
    stipend int check(stipend>0),
    -- mentor_id varchar(50) not null,
    -- position varchar(30) not null,
    -- role_id varchar(10) not null,
    start_date DATE not null,
    expected_end_date DATE not null,
    -- current_status BOOLEAN not null,
    primary key (email_id),
    -- foreign key (mentor_id) references employee(email_id),
    foreign key (email_id) references person(email_id) on delete cascade on update cascade
    -- foreign key role_id references role(id)
);
create table is_mentor(
    intern_id varchar(50) not null,
    mentor_id varchar(50) not null,
    primary key (intern_id),
    foreign key (intern_id) references intern(email_id) on delete cascade on update cascade,
    foreign key (mentor_id) references employee(email_id) on delete cascade on update cascade
);



create table has_role(
    email_id varchar(50) not null,
    role_id varchar(10) not null,
    primary key (email_id, role_id),
    foreign key (email_id) references person(email_id) on delete cascade on update cascade,
    foreign key (role_id) references role(id) on delete cascade on update cascade  
);

-- create table stage(
--     stage_id int not null,
--     description varchar(50) not null,
--     primary key stage_id
-- );

-- create table applicant(
--     email_id varchar(50) not null,
--     interviewer_id varchar(50),
--     schedule date,
--     stage_id int not null,
--     primary key email_id,
--     foreign key email_id references person,
--     foreign key interviewer_id references employee(email_id),
--     foreign key stage_id references stage
-- );





create table is_completed(
    email_id varchar(50) not null,
    end_date DATE not null,
    score int not null check(score>=0 and score<=10),
    performance_desc varchar(1000),
    primary key (email_id),
    foreign key (email_id) references intern(email_id) on delete cascade on update cascade
);

-- create table has_role(

-- )




create table at_location(
    email_id varchar(50) not null,
    location_id varchar(10) not null unique,
    primary key (email_id),
    foreign key (email_id) references person(email_id) on delete cascade on update cascade,
    foreign key (location_id) references location(location_id) on delete cascade on update cascade
);


create table assigned_to(
    email_id varchar(50) not null,
    project_id varchar(10) not null,
    assigned_date date not null,
    end_date date,
    primary key (email_id),
    foreign key (email_id) references intern(email_id) on delete cascade on update cascade,
    foreign key (project_id) references project(project_id) on delete cascade on update cascade
);



create table studies_at(
    email_id varchar(50) not null,
    university_id int not null,
    cpi decimal(10,2) not null,
    passing_year int not null check(passing_year>2000),
    primary key (email_id),
    foreign key (email_id) references person(email_id) on delete cascade on update cascade,
    foreign key (university_id) references university(id) on delete cascade on update cascade
);





-- create table previous_interns(
--     email_id varchar(50) not null,
--     stipend int check(stipend>0),
--     mentor_id varchar(50) not null,
--     end_date date not null,
--     start_date date not null,
--     score int check(score>=0 and score<=10) not null,
--     performance_desc 
--     -- role_id varchar(10) not null,
--     primary key email_id,
--     foreign key mentor_id references employee(email_id),
--     foreign key email_id references person,
--     -- foreign key role_id references role(id)
-- );