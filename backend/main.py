from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, BackgroundTasks
from firebase_client import db
from pydantic import BaseModel
import calendar
import math
import subprocess
from fastapi.middleware.cors import CORSMiddleware
from scripts.fetch_emails import fetch_latest_email
from scripts.parse_pdf import extract_store_data
from scripts.insert_data import insert_data
import os
import subprocess
from fastapi.responses import JSONResponse
import asyncio

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define the structure for budget updates
class BudgetUpdate(BaseModel):
    date: str  # Format: YYYY-MM-DD
    total_sales: float
    service_sales: float
    cfna_sales: float
    total_units: int
    branded_units: int
    boss_count: int
    rubber_gp: float

# Define the structure for setting a monthly budget
class MonthlyBudget(BaseModel):
    total_sales: float
    service_sales: float
    cfna_sales: float
    total_units: int
    branded_units: int
    boss_count: int
    rubber_gp: float

@app.get("/")
def read_root():
    return {"message": "API is running!"}

@app.get("/get-monthly-budget")
def get_monthly_budget(month: str):
    try:
        # Retrieve the budget document for the given month
        doc_ref = db.collection("monthly_budgets").document(month)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Monthly budget not set")

        return doc.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get-budget/{date}")
def get_budget_entry(date: str):
    try:
        doc_ref = db.collection("budget_entries").document(date)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Entry not found")

        return doc.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 1️⃣ API to Edit an Existing Entry
@app.put("/update-budget/{date}")
def edit_budget(date: str, data: BudgetUpdate):
    try:
        doc_ref = db.collection("budget_entries").document(date)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Entry not found")

        doc_ref.update(data.dict())
        return {"message": "Budget entry updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2️⃣ API to Delete a Budget Entry
@app.delete("/delete-budget/{date}")
def delete_budget(date: str):
    try:
        doc_ref = db.collection("budget_entries").document(date)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Entry not found")

        doc_ref.delete()
        return {"message": "Budget entry deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 1️⃣ API to Set Monthly Budget
@app.post("/set-monthly-budget")
def set_monthly_budget(month: str, budget: MonthlyBudget):
    try:
        # Save budget details for the specific month
        doc_ref = db.collection("monthly_budgets").document(month)
        doc_ref.set(budget.dict())
        return {"message": f"Budget for {month} set successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2️⃣ API to Submit Daily Budget Updates
@app.post("/update-budget")
def update_budget(data: BudgetUpdate):
    try:
        doc_ref = db.collection("budget_entries").document(data.date)
        doc_ref.set(data.dict())  # Save to Firestore
        return {"message": "Budget update recorded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3️⃣ API to Retrieve Current Progress
@app.get("/get-progress")
def get_progress(month: str):
    try:
        budget_entries = db.collection("budget_entries").where("date", ">=", f"{month}-01").where("date", "<=", f"{month}-31").stream()
        progress = {field: 0 for field in MonthlyBudget.__fields__.keys()}  # Initialize progress

        for entry in budget_entries:
            data = entry.to_dict()
            for field in progress:
                progress[field] += data.get(field, 0)

        return {"progress": progress}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4️⃣ FIXED: Correct Month Handling for Daily Targets
@app.get("/calculate-targets")
def calculate_targets(month: str):
    try:
        print(f"?? API HIT: /calculate-targets with month={month}")
        # Extract year and month from input (e.g., "2025-02")
        year, month = map(int, month.split("-"))

        # Get total days in the month
        total_days_in_month = calendar.monthrange(year, month)[1]

        # Get today's date
        today = datetime.today().date()
        

        # Set the first and last day of the entered month
        first_day_of_month = datetime(year, month, 1).date()
        last_day_of_month = datetime(year, month, total_days_in_month).date()

        # Calculate remaining days (if in past, return 0)
        days_left = max(0, (last_day_of_month - today).days + 1)
        print(f"🔢 Days Left (after fix): {days_left}")

        # Retrieve the budget for the specified month
        budget_doc = db.collection("monthly_budgets").document(f"{year}-{str(month).zfill(2)}").get()
        if not budget_doc.exists:
            raise HTTPException(status_code=404, detail="Monthly budget not set")

        monthly_budget = budget_doc.to_dict()

        # Get progress from budget entries for the specified month
        budget_entries = db.collection("budget_entries").where(
            "date", ">=", f"{year}-{str(month).zfill(2)}-01"
        ).where(
            "date", "<=", f"{year}-{str(month).zfill(2)}-{total_days_in_month}"
        ).stream()

        # Initialize progress tracking
        progress = {field: 0 for field in monthly_budget.keys()}

        for entry in budget_entries:
            data = entry.to_dict()
            for field in progress:
                progress[field] += data.get(field, 0)

        # Calculate remaining budget (Monthly Goal - Progress)
        remaining_budget = {field: max(0, monthly_budget[field] - progress[field]) for field in monthly_budget.keys()}

        if days_left <= 0:
            return {"message": "No days left in the selected month to calculate targets."}

        # ✅ Always round up daily targets
        daily_targets = {field: math.ceil(remaining_budget[field] / days_left) for field in remaining_budget.keys()}

        return {"daily_targets": daily_targets}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

    # ✅ Fetch Latest Email
@app.get("/fetch-email")
def fetch_email(background_tasks: BackgroundTasks):
    """Triggers fetching the latest email and parsing attached PDF."""
    background_tasks.add_task(subprocess.run, ["python", "scripts/fetch_emails.py"])
    return {"message": "Fetching latest email in the background."}

# ✅ Parse the Most Recent PDF
@app.get("/parse-pdf")
def parse_pdf(background_tasks: BackgroundTasks):
    """Triggers parsing the most recent PDF from the reports folder."""
    background_tasks.add_task(subprocess.run, ["python", "scripts/parse_pdf.py"])
    return {"message": "Parsing the latest PDF in the background."}

# ✅ Insert Data into Firebase
@app.get("/insert-data")
def insert_data(background_tasks: BackgroundTasks):
    """Triggers inserting parsed PDF data into the Firestore database."""
    background_tasks.add_task(subprocess.run, ["python", "scripts/insert_data.py"])
    return {"message": "Inserting data into the database in the background."}

@app.post("/fetch-and-insert")
def fetch_and_insert_data(background_tasks: BackgroundTasks):
    """Fetches the latest email, extracts sales data from PDF, and inserts it into Firestore."""
    try:
        # ✅ Step 1: Fetch latest email with a PDF attachment
        pdf_path = fetch_latest_email()
        if not pdf_path:
            return {"message": "No new reports found."}

        # ✅ Step 2: Extract sales data from PDF
        store_data = extract_store_data(pdf_path, "003050")  # Adjust for store ID
        if not store_data:
            return {"message": "No valid sales data found in the report."}

        # ✅ Step 3: Insert into Firestore
        report_date = store_data.pop("report_date")  # Remove date from dict to use separately
        insert_data(report_date, store_data)

        return {"message": "Sales data successfully inserted!", "data": store_data}

    except Exception as e:
        return {"error": str(e)}
    
@app.post("/run-ingest")
async def run_ingest():
    try:
        script_path = os.path.abspath(os.path.join("scripts", "ingest.py"))
        cwd_path = os.path.dirname(script_path)

        # Run subprocess in a background thread
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: subprocess.run(
                ["python", script_path],
                cwd=cwd_path,
                capture_output=True,
                text=True
            )
        )

        print("STDOUT:\n", result.stdout)
        print("STDERR:\n", result.stderr)

        if result.returncode == 0:
            return {"status": "success", "output": result.stdout}
        else:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "stderr": result.stderr, "stdout": result.stdout},
            )

    except asyncio.CancelledError:
        print("⚠️ Task was cancelled due to app shutdown")
        return JSONResponse(status_code=500, content={"error": "Ingest task cancelled during shutdown"})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})