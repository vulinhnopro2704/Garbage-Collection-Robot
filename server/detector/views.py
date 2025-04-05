# detector/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from PIL import Image

from .yolo_model import predict_image
from .firebase_config import send_notification, db

class HelloWorldAPIView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "Hello World"})

class ImageDetectAPIView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        # Kiểm tra file ảnh
        if 'image' not in request.FILES:
            return Response({"error": "No image uploaded"}, status=400)

        image_file = request.FILES['image']
        try:
            image = Image.open(image_file)
        except Exception as e:
            return Response({"error": f"Invalid image: {str(e)}"}, status=400)

        # Chạy model dự đoán
        results = predict_image(image)

        # Ví dụ: Lưu kết quả vào Firestore (tùy chỉnh theo nhu cầu của bạn)
        doc_ref = db.collection("detections").document()
        doc_ref.set({
            "results": results,
            "status": "processed"
        })

        # Ví dụ: Gửi push notification lên thiết bị Android
        # Lưu ý: Bạn cần có token của thiết bị (thông thường lưu ở Firestore hoặc gửi kèm theo request)
        # Ở đây mình demo với token được gửi kèm theo request (nếu có)
        device_token = request.data.get("device_token", None)
        if device_token:
            try:
                notif_response = send_notification(
                    token=device_token,
                    title="Detection Completed",
                    body="Your image has been processed successfully!"
                )
            except Exception as e:
                notif_response = f"Notification error: {str(e)}"
        else:
            notif_response = "No device token provided."

        return Response({
            "results": results,
            "notification": notif_response
        })
