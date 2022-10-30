import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

conn = mysql.connector.connect(
    host = "localhost",
    port = "3306",
    user = "root",
    password = os.getenv("MYSQL_PASSWORD"),
    database = "company"
)
