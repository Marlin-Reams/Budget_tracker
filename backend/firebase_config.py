import os
import firebase_admin
from firebase_admin import credentials, firestore

# Use Render path if deployed, else fallback to local path
CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase_credentials.json")

if not os.path.exists(CREDENTIALS_PATH):
    raise ValueError(f"🔥 FIREBASE_CREDENTIALS_PATH not found at {CREDENTIALS_PATH}")

# Initialize Firebase
cred = credentials.Certificate(CREDENTIALS_PATH)
firebase_admin.initialize_app(cred)

# Connect to Firestore
db = firestore.client()


