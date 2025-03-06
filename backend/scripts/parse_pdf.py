import re
import pdfplumber
from datetime import datetime

# Store ID to extract
STORE_ID = "003050"

def extract_store_data(pdf_path, store_id):
    """Extracts sales and performance data for a specific store from the PDF report."""
    extracted_data = {}

    with pdfplumber.open(pdf_path) as pdf:
        store_rows = []
        report_date = None

        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue

            # Extract the date from the first page header
            if not report_date:
                match = re.search(r"Printed:\s+(\d{1,2}/\d{1,2}/\d{4})", text)
                if match:
                    report_date = match.group(1)
                    formatted_date = datetime.strptime(report_date, "%m/%d/%Y").strftime("%Y-%m-%d")
                    extracted_data["report_date"] = formatted_date 

            # Find all occurrences of the store ID
            store_rows += [line for line in text.split("\n") if store_id in line]

        # Ensure we have enough data rows
        if len(store_rows) < 2:
            print(f"⚠️ Not enough data rows found for store {store_id}")
            return None

        try:
            first_row = re.split(r'\s+', store_rows[0])  
            second_row = re.split(r'\s+', store_rows[1])  

            # Extract necessary values
            extracted_data.update({
                "boss_count": first_row[5],  
                "total_sales": first_row[8],  
                "service_sales": first_row[11],  
                "cfna_sales": first_row[14],  
                "total_units": first_row[17],  
                "branded_units": first_row[20],  
                "rubber_gp": second_row[13],  
            })

            return extracted_data

        except IndexError:
            print(f"⚠️ Error extracting values for store {store_id}. Check row formatting.")
            return None

if __name__ == "__main__":
    pdf_path = "backend/reports/DailySalesMargin.AllStoresBdgt.CAGR.pdf"
    data = extract_store_data(pdf_path, STORE_ID)
    if data:
        print("\n✅ Extracted Store Data:", data)







