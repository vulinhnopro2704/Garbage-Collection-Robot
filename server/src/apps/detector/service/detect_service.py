# detector/yolo_model.py
import os
import base64
from io import BytesIO
from pathlib import Path
from ultralytics import YOLO
import cv2
import numpy as np

# Xác định đường dẫn tương đối đến mô hình YOLO
CURRENT_DIR = Path(__file__).resolve().parent
MODEL_PATH = CURRENT_DIR.parent / "ml_models" / "yolov11.pt"

# Đảm bảo đường dẫn chính xác
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Không tìm thấy mô hình YOLO tại {MODEL_PATH}")

model = YOLO(MODEL_PATH)

def predict_image(image):
    """
    Hàm xử lý ảnh với model YOLOv11 và trả về kết quả dưới dạng JSON.
    :param image: Ảnh đầu vào (PIL Image hoặc định dạng mà model chấp nhận).
    :return: Tuple chứa (kết quả dự đoán dưới dạng JSON, ảnh đã xử lý dưới dạng base64).
    """
    # Convert PIL image to cv2 format
    img_array = np.array(image)
    if img_array.shape[2] == 4:  # RGBA
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGBA2RGB)
    else:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

    # Run prediction
    results = model(img_array, save=True)
    result = results[0]
    
    # Plot boxes on image
    annotated_img = result.plot()
    
    # Convert back to RGB for PIL
    annotated_img = cv2.cvtColor(annotated_img, cv2.COLOR_BGR2RGB)
    
    # Convert the processed image to base64 - fix the encoding
    # Make sure we have a clean base64 string without the data:image prefix
    is_success, buffer = cv2.imencode('.jpg', annotated_img)
    if not is_success:
        raise Exception("Failed to encode the processed image")
    
    processed_img_base64 = base64.b64encode(buffer).decode('utf-8')
    
    # Return tuple of detection results and processed image base64
    return result, processed_img_base64
