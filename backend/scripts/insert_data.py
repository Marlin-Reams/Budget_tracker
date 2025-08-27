import sys
import os

# ✅ Ensure the script can find `firebase_config.py`
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from firebase_client import db  # ✅ Import Firestore DB
from datetime import datetime

def insert_data(report_date, store_data):
    try:
        # Try parsing as MM/DD/YYYY
        try:
            formatted_date = datetime.strptime(report_date, "%m/%d/%Y").strftime("%Y-%m-%d")
        except ValueError:
            # Already in YYYY-MM-DD format
            formatted_date = report_date

        doc_ref = db.collection("budget_entries").document(formatted_date)
        doc_ref.set(store_data)
        print(f" Successfully inserted data for {formatted_date}")

    except Exception as e:
        print(f" Error inserting data: {e}")

# # ✅ Testing Locally
# if __name__ == "__main__":
#     # Example Data (Will be replaced by `parse_pdf.py`)
#     test_store_data = {
#         "total_sales": 6293,
#         "service_sales": 6187,
#         "cfna_sales": 2793,
#         "total_units": 1,
#         "branded_units": 0,
#         "boss_count": 23,
#         "rubber_gp": 8,
#     }

#     test_report_date = "02/25/2025"  # Example date
#     insert_data(test_report_date, test_store_data)
