# backend/scripts/ingest.py
import sys, os
from pathlib import Path
from fetch_emails import fetch_latest_email
print(">>> Ingest script started")


# ⏬ Pull the latest email every time ingest runs
fetched_path = fetch_latest_email()
if fetched_path:
    print(f" Latest report downloaded: {fetched_path}")
else:
    print(" No new email found or error occurred.")



# allow imports from ../ (firebase_config, parse_pdf, insert_data)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from parse_pdf import extract_store_data, STORE_ID as DEFAULT_STORE_ID, DEFAULT_FILENAME as DEFAULT_PDF

# Try to import your writer module
try:
    import insert_data as writer
except Exception as e:
    writer = None

def resolve_pdf_path(arg_path_or_name: str | None) -> Path | None:
    here = Path(__file__).resolve().parent
    backend = here.parent
    reports_dir = backend / "reports"
    alt_reports_dir = backend / "backend" / "scripts" / "backend" / "reports"
    candidates: list[Path] = []

    if arg_path_or_name:
        p = Path(arg_path_or_name).expanduser()
        if p.suffix.lower() != ".pdf":
            p = p.with_suffix(".pdf")
        candidates += [p.resolve(), reports_dir / p.name, alt_reports_dir / p.name]

    candidates += [reports_dir / DEFAULT_PDF, alt_reports_dir / DEFAULT_PDF]
    for c in candidates:
        try:
            if c.exists():
                return c.resolve()
        except Exception:
            pass
    return None

def _ensure_iso_date(s: str) -> str:
    from datetime import datetime
    s = s.strip()
    try:
        # First try ISO format (already correct)
        datetime.strptime(s, "%Y-%m-%d")
        return s
    except ValueError:
        # Then try old MM/DD/YYYY format and convert
        return datetime.strptime(s, "%m/%d/%Y").strftime("%Y-%m-%d")


def _num(x):
    if x is None or isinstance(x, (int, float)): return x
    t = str(x).strip()
    neg = t.startswith("(") and t.endswith(")")
    t = t.replace("$","").replace(",","").replace("%","").replace("(","").replace(")","")
    try:
        v = float(t)
        if v.is_integer(): v = int(v)
        return -v if neg else v
    except: return x

def _normalize(store_data: dict) -> dict:
    keys = ["total_sales","service_sales","cfna_sales","total_units","branded_units","boss_count","rubber_gp"]
    return {k: _num(store_data[k]) for k in keys if k in store_data}

def inline_insert(report_date: str, store_data: dict, *, collection="budget_entries"):
    """Fallback if writer.insert_data is unavailable."""
    from firebase_config import db
    iso = _ensure_iso_date(report_date)
    payload = _normalize(store_data)
    db.collection(collection).document(iso).set(payload, merge=True)
    print(f" (fallback) inserted {collection}/{iso}: {payload}")

def main():
    arg_pdf = sys.argv[1] if len(sys.argv) >= 2 else None
    arg_store = sys.argv[2] if len(sys.argv) >= 3 else None

    pdf_path = resolve_pdf_path(arg_pdf)
    if not pdf_path:
        print(" PDF not found.")
        raise SystemExit(1)

    store_id = arg_store or DEFAULT_STORE_ID
    print(f" Using: {pdf_path}")
    print(f" Store: {store_id}")

    parsed = extract_store_data(str(pdf_path), store_id)
    if parsed is None:
        print(" Parse failed.")
        raise SystemExit(1)

    # Support both shapes
    if isinstance(parsed, dict) and "report_date" in parsed:
        rd = parsed.pop("report_date")
        data = parsed
    else:
        rd, data = parsed  # type: ignore

    data["date"] = rd

    if writer and hasattr(writer, "insert_data"):
        writer.insert_data(rd, data)  # your existing writer
    else:
        print(" insert_data not found in insert_data.py; using inline fallback.")
        inline_insert(rd, data)

    print(" Ingest complete.")

print(">>> Ingest script completed")

if __name__ == "__main__":
    main()


