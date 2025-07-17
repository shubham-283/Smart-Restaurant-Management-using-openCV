import mysql.connector
import os
import dotenv

dotenv.load_dotenv()


db = mysql.connector.connect(
    host=os.getenv("SQLHost"),
    user=os.getenv("SQLUser"),
    password=os.getenv("SQLPassword"),
    database=os.getenv("SQLDatabase"),
    connection_timeout=10,
)

cursor = db.cursor()