# detector/firebase_config.py
import firebase_admin
from firebase_admin import credentials, messaging, firestore

# Khởi tạo Firebase App
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)

# Khởi tạo Firestore client
db = firestore.client()

def send_notification(token: str, title: str, body: str) -> str:
    """
    Gửi thông báo qua FCM.
    :param token: FCM device token của thiết bị Android.
    :param title: Tiêu đề thông báo.
    :param body: Nội dung thông báo.
    :return: Response message ID.
    """
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        token=token,
    )
    response = messaging.send(message)
    return response
