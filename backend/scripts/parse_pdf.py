# import re
# import pdfplumber
# from datetime import datetime
# from pathlib import Path

# # Store ID to extract
# STORE_ID = "018430"

# def extract_store_data(pdf_path, store_id):
#     """Extracts sales and performance data for a specific store from the PDF report."""
#     extracted_data = {}

#     with pdfplumber.open(pdf_path) as pdf:
#         store_rows = []
#         report_date = None

#         for page in pdf.pages:
#             text = page.extract_text()
#             if not text:
#                 continue

#             # Extract the date from the first page header
#             if not report_date:
#                 match = re.search(r"Printed:\s+(\d{1,2}/\d{1,2}/\d{4})", text)
#                 if match:
#                     report_date = match.group(1)
#                     formatted_date = datetime.strptime(report_date, "%m/%d/%Y").strftime("%Y-%m-%d")
#                     extracted_data["report_date"] = formatted_date 

#             # Find all occurrences of the store ID
#             store_rows += [line for line in text.split("\n") if store_id in line]

#         # Ensure we have enough data rows
#         if len(store_rows) < 2:
#             print(f"⚠️ Not enough data rows found for store {store_id}")
#             return None

#         try:
#             first_row = re.split(r'\s+', store_rows[0])  
#             second_row = re.split(r'\s+', store_rows[1])  

#             # Extract necessary values
#             extracted_data.update({
#                 "boss_count": first_row[4],  
#                 "total_sales": first_row[7],  
#                 "service_sales": first_row[10],  
#                 "cfna_sales": first_row[13],  
#                 "total_units": first_row[16],  
#                 "branded_units": first_row[19],  
#                 "rubber_gp": second_row[12],  
#             })

#             return extracted_data

#         except IndexError:
#             print(f"⚠️ Error extracting values for store {store_id}. Check row formatting.")
#             return None

# # if __name__ == "__main__":
# #     pdf_path = "backend/backend/reports/DailySalesMargin.AllStoresBdgt.NFWP.pdf"
# #     data = extract_store_data(pdf_path, STORE_ID)
# #     if data:
# #         print("\n✅ Extracted Store Data:", data)
# if __name__ == "__main__":
#     # Resolve project folders relative to THIS script file
#     script_dir = Path(__file__).resolve().parent                 # .../backend/scripts
#     backend_dir = script_dir.parent                               # .../backend
#     reports_dir = backend_dir / "reports"                         # .../backend/reports
#     alt_reports_dir = backend_dir / "backend" / "reports"         # .../backend/backend/reports (just in case)

#     filename = "DailySalesMargin.AllStoresBdgt.NFWP.pdf"

#     # Try both possible locations
#     candidates = [
#         reports_dir / filename,
#         alt_reports_dir / filename,
#     ]

#     pdf_path = None
#     for c in candidates:
#         if c.exists():
#             pdf_path = c
#             break

#     if not pdf_path:
#         print("❌ Could not find the PDF. I looked here:")
#         for c in candidates:
#             print("  -", c)
#         # Show what's actually in those folders to help debug
#         print("\n📂 Contents of", reports_dir)
#         if reports_dir.exists():
#             for p in reports_dir.glob("*.pdf"):
#                 print("  -", p.name)
#         print("\n📂 Contents of", alt_reports_dir)
#         if alt_reports_dir.exists():
#             for p in alt_reports_dir.glob("*.pdf"):
#                 print("  -", p.name)
#         raise SystemExit(1)

#     print("📄 Using:", pdf_path)

#     data = extract_store_data(str(pdf_path), STORE_ID)
#     if data:
#         # Your original code only returned the dict; if you upgraded to return (date, dict), adjust here
#         print("\n✅ Extracted Store Data:", data)

import re
import pdfplumber
from datetime import datetime
from pathlib import Path
from typing import Optional, Tuple, Dict

STORE_ID = "018430"
DEFAULT_FILENAME = "DailySalesMargin.AllStoresBdgt.NFWP.pdf"

# Single source of truth for token positions (easy to tweak later)
POSITIONS = {
    "sales_line": {  # Page 1 (Daily Sales)
        "boss_count": 4,
        "total_sales": 7,
        "service_sales": 10,
        "cfna_sales": 13,
        "total_units": 16,
        "branded_units": 19,
    },
    "gp_line": {     # Page 2 (GP/Margins)
        "rubber_gp": 12,
    },
}

REPORT_DATE_RE = re.compile(r"DAILY SALES AND MARGIN REPORT\s*-\s*(\d{1,2}/\d{1,2}/\d{4})", re.I)


def _to_number(s: Optional[str]):
    if s is None:
        return None
    t = str(s).strip()
    if not t:
        return None
    neg = t.startswith("(") and t.endswith(")")
    t = (
        t.replace("$", "")
         .replace(",", "")
         .replace("%", "")
         .replace("(", "")
         .replace(")", "")
         .strip()
    )
    try:
        v = float(t)
        if v.is_integer():
            v = int(v)
        return -v if neg else v
    except Exception:
        return s  # return raw token if it's not numeric

def _get_report_date_iso(text: str) -> Optional[str]:
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if "DAILY SALES AND MARGIN REPORT" in line.upper():
            # Check the next line if available
            if i + 1 < len(lines):
                date_match = re.search(r"(\d{1,2}/\d{1,2}/\d{4})", lines[i + 1])
                if date_match:
                    return datetime.strptime(date_match.group(1), "%m/%d/%Y").strftime("%Y-%m-%d")
    return None

def _first_line_with_store(text: str, store_id: str) -> Optional[str]:
    for ln in (text or "").split("\n"):
        if store_id in ln:
            return ln
    return None

def _tokens(line: str):
    return [t for t in re.split(r"\s+", (line or "").strip()) if t]

def _extract(tokens, mapping: Dict[str, int]) -> Dict[str, object]:
    out: Dict[str, object] = {}
    for key, idx in mapping.items():
        out[key] = _to_number(tokens[idx] if idx < len(tokens) else None)
    return out

def extract_store_data(pdf_path: str, store_id: str) -> Optional[Tuple[str, Dict[str, object]]]:
    """
    Returns (report_date_iso, {
      boss_count, total_sales, service_sales, cfna_sales, total_units, branded_units, rubber_gp
    })
    """
    pdf_path = str(Path(pdf_path))
    per_page_lines = []
    report_date_iso = None

    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            if not report_date_iso:
                report_date_iso = _get_report_date_iso(text) or report_date_iso


            # Keep ONLY the first matching line per page (preserves page order)
            

            line = _first_line_with_store(text, store_id)
            if line:
                per_page_lines.append(line)

    if len(per_page_lines) < 2:
        print(f"⚠️ Expected ≥2 store lines (one per page). Found {len(per_page_lines)}.")
        # Save whatever we found for quick debugging
        Path(__file__).with_name("last_lines.txt").write_text(
            "\n---\n".join(per_page_lines), encoding="utf-8"
        )
        return None

    # Page 1 -> sales; Page 2 -> GP (your report convention)
    sales_line, gp_line = per_page_lines[0], per_page_lines[1]
    sales_tokens, gp_tokens = _tokens(sales_line), _tokens(gp_line)

    # Debug snapshot (super handy if columns ever shift)
    Path(__file__).with_name("last_lines.txt").write_text(
        f"PAGE1:\n{sales_line}\nTOKENS({len(sales_tokens)}): {sales_tokens}\n\n"
        f"PAGE2:\n{gp_line}\nTOKENS({len(gp_tokens)}): {gp_tokens}\n",
        encoding="utf-8"
    )

    # Quick shape sanity check
    need_sales = max(POSITIONS["sales_line"].values())
    need_gp = max(POSITIONS["gp_line"].values())
    if len(sales_tokens) <= need_sales or len(gp_tokens) <= need_gp:
        print(f"⚠️ Row shapes might have shifted. sales_len={len(sales_tokens)} (need>{need_sales}), gp_len={len(gp_tokens)} (need>{need_gp})")

    # Extract fields by positions
    data: Dict[str, object] = {}
    data.update(_extract(sales_tokens, POSITIONS["sales_line"]))
    data.update(_extract(gp_tokens, POSITIONS["gp_line"]))

    return (report_date_iso or "YYYY-MM-DD"), data

# ---------------- CLI runner ----------------
if __name__ == "__main__":
    import sys
    script_dir = Path(__file__).resolve().parent                 # .../backend/scripts
    backend_dir = script_dir.parent                               # .../backend
    reports_dir = backend_dir / "reports"                         # .../backend/reports
    alt_reports_dir = backend_dir / "backend" / "reports"         # .../backend/backend/reports (just in case)

    filename = DEFAULT_FILENAME
    if len(sys.argv) > 1:
        pdf_path = Path(sys.argv[1]).expanduser().resolve()
    else:
        # Try both possible locations
        candidates = [reports_dir / filename, alt_reports_dir / filename]
        pdf_path = next((c for c in candidates if c.exists()), None)

    if not pdf_path or not pdf_path.exists():
        print("❌ Could not find the PDF. I looked here:")
        print("  -", reports_dir / filename)
        print("  -", alt_reports_dir / filename)
        # List contents to help debug
        if reports_dir.exists():
            print("\n📂 In", reports_dir)
            for p in reports_dir.glob("*.pdf"):
                print("  -", p.name)
        if alt_reports_dir.exists():
            print("\n📂 In", alt_reports_dir)
            for p in alt_reports_dir.glob("*.pdf"):
                print("  -", p.name)
        raise SystemExit(1)

    print("📄 Using:", pdf_path)
    rd, payload = extract_store_data(str(pdf_path), STORE_ID)
    if payload is not None:
        print("✅ Report date:", rd)
        print("✅ Metrics:", payload)

