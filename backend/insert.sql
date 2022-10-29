insert into credentials values("admin@company.com", "MyPass"),
                                ("shashank@company.com", "MyPass"),
                                ("varendra@company.com", "MyPass"),
                                ("anand@gmail.com", "MyPass"),
                                ("aryan@trimukhe.com", "Nasha"),
                                ("pavan@kumar.com", "Pavini"),
                                ("arvind@hari.com", "RITH");

insert into university(name, standing, city, country) values("Others", NULL, "NULL", "NULL"),
                                ("IIT Dharwad", 1, "Dharwad", "India"),
                                ("IIT Bombay", 52, "Bombay", "India"),
                                ("MIT", 45, "Massachusetts", "USA"),
                                ("Technische", 125,"Munchen", "Germany"),
                                ("Tokyo Institute of Technology", 200,"Tokyo", "Japan"),
                                ("University of Melbourne", NULL, "Melbourne", "Australia");

insert into role values("1", "admin", "All Administrative Access."),
                        ("2", "employee", "Can assign projects"),
                        ("3", "intern", "Can view his/her projects");


insert into has_role values("admin@company.com", "1");