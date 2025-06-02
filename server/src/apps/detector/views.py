# detector/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from PIL import Image
import base64
import io
import uuid
from datetime import datetime
import tempfile
import os

# Import services
from .service.detect_service import predict_image
from ..storage.firebase_config import db, fcm as messaging
from ..storage.services.cloudinary_service import upload_image_file, upload_image_base64

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
            # Open image with PIL for detection
            image = Image.open(image_file)
            
            # Save image to a temporary file to ensure it can be properly read by Cloudinary
            with tempfile.NamedTemporaryFile(delete=False, suffix=f".{image.format.lower() if image.format else 'jpg'}") as temp_file:
                temp_path = temp_file.name
                image.save(temp_path)
            
            # Upload original image to Cloudinary with detailed error handling
            try:
                with open(temp_path, 'rb') as img_file:
                    original_upload = upload_image_file(img_file, folder="detections/original")
                # Remove temporary file
                os.unlink(temp_path)
                
                if not original_upload["success"]:
                    return Response({"error": f"Failed to upload original image: {original_upload['error']}"}, status=500)
            except Exception as cloud_error:
                # Clean up in case of error
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
                return Response({
                    "error": f"Cloudinary upload error: {str(cloud_error)}",
                    "details": "Error occurred while uploading original image"
                }, status=500)
                
        except Exception as e:
            return Response({"error": f"Invalid image: {str(e)}"}, status=400)

        # Chạy model dự đoán - nhận kết quả và ảnh đã xử lý
        results, processed_image_base64 = predict_image(image)
        
        # Lưu ảnh đã xử lý vào Cloudinary
        try:
            processed_upload = upload_image_base64(
                processed_image_base64, 
                folder="detections/processed"
            )
            if not processed_upload["success"]:
                return Response({"error": f"Failed to upload processed image: {processed_upload['error']}"}, status=500)
        except Exception as cloud_error:
            return Response({
                "error": f"Cloudinary upload error: {str(cloud_error)}",
                "details": "Error occurred while uploading processed image"
            }, status=500)

        # Lưu kết quả và URL ảnh vào Firestore
        doc_ref = db.collection("detections").document()
        
        def convert_results_to_dict(results):
            """Convert ultralytics Results object to a Firestore-compatible dictionary."""
            # Extract basic information
            result_dict = {
                "path": str(results.path),
                "orig_shape": list(map(int, results.orig_shape)) if hasattr(results, 'orig_shape') else [],
                "save_dir": str(results.save_dir),
                "speed": {
                    "preprocess": float(results.speed.get("preprocess", 0)),
                    "inference": float(results.speed.get("inference", 0)),
                    "postprocess": float(results.speed.get("postprocess", 0))
                }
            }

            # Extract detected objects from boxes if available
            if hasattr(results, 'boxes') and results.boxes is not None:
                boxes = []
                for i, box in enumerate(results.boxes):
                    if hasattr(box, 'xyxy') and box.xyxy is not None:
                        # Convert numpy arrays to plain Python lists and ensure all values are primitive types
                        xyxy_list = []
                        for coord in box.xyxy.tolist()[0]:
                            xyxy_list.append(float(coord))
                    else:
                        xyxy_list = []
                        
                    box_dict = {
                        "xyxy": xyxy_list,
                        "conf": float(box.conf.item()) if hasattr(box, 'conf') else 0.0,
                        "cls": int(box.cls.item()) if hasattr(box, 'cls') else 0
                    }
                    
                    # Add class name if available
                    if hasattr(box, 'cls') and hasattr(results, 'names'):
                        class_idx = int(box.cls.item())
                        if class_idx in results.names:
                            box_dict["class_name"] = str(results.names[class_idx])
                        else:
                            box_dict["class_name"] = "unknown"
                    else:
                        box_dict["class_name"] = "unknown"
                        
                    boxes.append(box_dict)
                result_dict["boxes"] = boxes
            
            return result_dict

        # Convert Results object to a dictionary before saving to Firestore
        results_dict = convert_results_to_dict(results)
        
        doc_ref.set({
            "results": results_dict,
            "original_image_url": original_upload["url"],
            "original_image_public_id": original_upload["public_id"],
            "processed_image_url": processed_upload["url"],
            "processed_image_public_id": processed_upload["public_id"],
            "image_format": image.format if image.format else "JPEG",
            "timestamp": datetime.now().isoformat(),
            "image_id": str(uuid.uuid4()),
            "status": "processed"
        })

        # Gửi push notification lên thiết bị Android
        device_token = request.data.get("device_token", None)
        if device_token:
            try:
                message = messaging.Message(
                    notification=messaging.Notification(
                        title="Detection Completed",
                        body="Your image has been processed successfully!"
                    ),
                    token=device_token,
                )
                notif_response = messaging.send(message)
            except Exception as e:
                notif_response = f"Notification error: {str(e)}"
        else:
            notif_response = "No device token provided."

        return Response({
            "results": results_dict,  # Use the dictionary instead of the raw Results object
            "original_image_url": original_upload["url"],
            "processed_image_url": processed_upload["url"],
            "notification": notif_response,
            "document_id": doc_ref.id
        })
