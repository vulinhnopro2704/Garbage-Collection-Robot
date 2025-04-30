# detector/firebase_client.py

import os
import firebase_admin
from firebase_admin import credentials, firestore, messaging
from firebase_admin import db as _rtdb
import pathlib

# Đường dẫn đến file key, có thể cấu hình qua biến môi trường
# Fallback to the firebase_key.json file in the project root if environment variable is not set
SERVICE_ACCOUNT_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH")
if not SERVICE_ACCOUNT_PATH:
    BASE_DIR = pathlib.Path(__file__).resolve().parent.parent.parent.parent
    SERVICE_ACCOUNT_PATH = os.path.join(BASE_DIR, 'firebase_key.json')

# Khởi tạo Firebase App (chỉ 1 lần)
if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)

# Expose Firestore client và Messaging client
db = firestore.client()
fcm = messaging
rtdb = _rtdb
