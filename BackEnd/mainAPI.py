from fastapi import FastAPI, Request, Depends, HTTPException, status, File, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from SQL_Action import Get_Menu, get_Weekly_sales, get_monthly_sales, get_sales_last_n_months, get_inventory, get_Prediction, update_inventory_for_dish
from Yolo_Prediction import detect
from Sale_prediction import predict_sales
from Smart_Inventory import get_tomorrow_predictions

import dotenv
import shutil
import os
import schedule
import threading
import asyncio
import time

dotenv.load_dotenv()

# Create an instance of FastAPI
app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schedule the job at 6:00 AM daily
schedule.every().day.at("06:00").do(predict_sales)

def run_scheduler():
    """Runs the schedule in a loop in a separate thread."""
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

# Start the scheduler in a background thread
scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
scheduler_thread.start()

@app.get("/Get_Menu")
async def Menu():
    return await asyncio.to_thread(Get_Menu)

@app.get("/get_Weekly_sales")
async def Weekly_sales():
    return await asyncio.to_thread(get_Weekly_sales)

@app.get("/get_Monthly_sales")
async def Monthly_sales():
    return await asyncio.to_thread(get_monthly_sales)

@app.get("/get_inventory_item")
async def inventory():
    return await asyncio.to_thread(get_inventory)

@app.get("/get_prediction")
async def prediction():
    return await asyncio.to_thread(get_Prediction)

@app.get("/get_inventory_predictions")
async def inventory_prediction():
    return await asyncio.to_thread(get_tomorrow_predictions)
class Database(BaseModel):
    Month: int

@app.post("/Get_Sales_Last_N_Months")
async def Get_Sales_Last(database: Database, request: Request):
    return await asyncio.to_thread(get_sales_last_n_months, database.Month)

class OrderData(BaseModel):
    dish_name: str
    quantity: int

@app.post("/add_order")
async def AddOrder(database: OrderData, request: Request):
    return await asyncio.to_thread(update_inventory_for_dish, database.dish_name, database.quantity)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_DIR}/{file.filename}"

    # Save the uploaded file asynchronously
    def save_file():
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    await asyncio.to_thread(save_file)

    # Run your detection function asynchronously
    label = await asyncio.to_thread(detect, file_path)

    return {"filename": label}

@app.get("/get-image")
async def get_image():
    file_path = r"D:\Smart-Restaurement-management-using-openCV\BackEnd\output.jpg"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path, media_type="image/png")

