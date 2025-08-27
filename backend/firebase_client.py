# backend/firebase_client.py
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

# ✅ Use JSON from Render environment
firebase_json = os.environ.get("FIREBASE_CREDENTIALS_JSON")
if not firebase_json:
    raise ValueError("FIREBASE_CREDENTIALS_JSON not set")

cred_dict = json.loads(firebase_json)
cred = credentials.Certificate(cred_dict)

# ✅ Prevent duplicate initialization on hot reloads
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()



