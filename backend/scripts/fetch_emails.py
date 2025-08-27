# import imaplib
# import email
# from email.header import decode_header
# import os

# # Email credentials
# EMAIL_USER = "fs.reports.auto@gmail.com"
# EMAIL_PASS = "syok wwjb eaxw drqt"  # Use your App Password
# SAVE_DIR = "backend/reports"  # 📂 Folder to save PDFs

# def fetch_latest_email():
#     """Connect to Gmail, fetch the latest unread email with a PDF, and mark it as read."""
#     try:
#         # Ensure save directory exists
#         os.makedirs(SAVE_DIR, exist_ok=True)

#         # Connect to Gmail
#         mail = imaplib.IMAP4_SSL("imap.gmail.com")
#         mail.login(EMAIL_USER, EMAIL_PASS)

#         # Select the "Daily Sales Reports" label
#         result, _ = mail.select('"Daily Sales Reports"')
#         if result != "OK":
#             print("❌ Failed to select 'Daily Sales Reports'. Check folder name.")
#             return None

#         # Search for UNREAD emails with attachments
#         result, data = mail.search(None, '(UNSEEN)')

#         email_ids = data[0].split()
#         if not email_ids:
#             print("📭 No new unread emails found.")
#             return None

#         # Fetch the latest unread email
#         latest_email_id = email_ids[-1]
#         result, msg_data = mail.fetch(latest_email_id, "(RFC822)")

#         # Parse email
#         raw_email = msg_data[0][1]
#         msg = email.message_from_bytes(raw_email)

#         subject, encoding = decode_header(msg["Subject"])[0]
#         if isinstance(subject, bytes):
#             subject = subject.decode(encoding if encoding else "utf-8")

#         print(f"📧 Subject: {subject}")

#         # Download attachment if it's a PDF
#         for part in msg.walk():
#             content_disposition = str(part.get("Content-Disposition"))
#             if part.get_content_maintype() == "multipart":
#                 continue
#             if "attachment" in content_disposition:
#                 filename = part.get_filename()
#                 if filename and filename.endswith(".pdf"):
#                     filepath = os.path.join(SAVE_DIR, filename)

#                     # Save the file
#                     with open(filepath, "wb") as f:
#                         f.write(part.get_payload(decode=True))

#                     print(f"📂 PDF Saved: {filepath}")

#                     # Mark the email as read
#                     mail.store(latest_email_id, "+FLAGS", "\\Seen")
#                     print("✅ Email marked as read.")
#                     return filepath

#         print("❌ No PDF attachment found.")
#         return None

#     except Exception as e:
#         print(f"❌ Error: {e}")

#     finally:
#         mail.logout()

# if __name__ == "__main__":
#     pdf_path = fetch_latest_email()
#     if pdf_path:
#         print(f"🚀 PDF Ready for Parsing: {pdf_path}")


import imaplib
import email
from email.header import decode_header
import os

# Email credentials (use App Password for Gmail 2FA)
EMAIL_USER = "fs.reports.auto@gmail.com"
EMAIL_PASS = "syok wwjb eaxw drqt"  # ← App password here
SAVE_DIR = "../reports"        # Where to save PDF attachments

def fetch_latest_email():
    """Connects to Gmail, downloads the latest unread email with a PDF attachment, marks it as read."""
    try:
        os.makedirs(SAVE_DIR, exist_ok=True)

        # Connect to Gmail
        print("Logging into Gmail...")
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(EMAIL_USER, EMAIL_PASS)

        # Select Gmail label/folder
        result, _ = mail.select('"DSM"')  # Quotes handle Gmail label names
        if result != "OK":
            print("Could not find label: 'Daily Sales Reports'")
            return None

        # Search for unread emails
        result, data = mail.search(None, '(UNSEEN)')
        if result != "OK":
            print(" Failed to search inbox.")
            return None

        email_ids = data[0].split()
        if not email_ids:
            print(" No unread emails found.")
            return None

        latest_email_id = email_ids[-1]
        result, msg_data = mail.fetch(latest_email_id, "(RFC822)")
        if result != "OK":
            print(" Failed to fetch email contents.")
            return None

        # Parse email
        raw_email = msg_data[0][1]
        msg = email.message_from_bytes(raw_email)
        subject, encoding = decode_header(msg["Subject"])[0]
        if isinstance(subject, bytes):
            subject = subject.decode(encoding if encoding else "utf-8")
        print(f" Subject: {subject}")

        # Walk through email parts to find PDF
        for part in msg.walk():
            content_disposition = str(part.get("Content-Disposition", ""))
            if part.get_content_maintype() == "multipart":
                continue
            if "attachment" in content_disposition:
                if part.get_filename() and part.get_filename().endswith(".pdf"):
                    # ✅ Force a consistent filename
                    forced_filename = "DailySalesMargin.AllStoresBdgt.NFWP.pdf"
                    filepath = os.path.join(SAVE_DIR, forced_filename)

                    # Save attachment to fixed filename
                    with open(filepath, "wb") as f:
                        f.write(part.get_payload(decode=True))

                    print(f" PDF saved to: {filepath}")

                    # Mark email as read
                    mail.store(latest_email_id, "+FLAGS", "\\Seen")
                    print(" Email marked as read.")

                    return filepath

        print(" No PDF attachment found in email.")
        return None

    except Exception as e:
        print(f" Error during fetch: {e}")
        return None

    finally:
        try:
            mail.logout()
        except:
            pass

# Manual run
if __name__ == "__main__":
    pdf_path = fetch_latest_email()
    if pdf_path:
        print(f" PDF Ready: {pdf_path}")



