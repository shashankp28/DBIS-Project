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
insert into at_location values("admin@company.com", "1");
insert into employee values("admin@company.com", 1000000);
insert into studies_at values("admin@company.com", "2", 9.71, 2016);

insert into location values("1", "Tech Park", "Banglore", "India"),
                            ("2", "Silicon Valley", "San Fransisco", "USA"),
                            ("3", "Golden bowl", "Beijing", "China"),
                            ("4", "Heaven", "South Pole", "Antartica");