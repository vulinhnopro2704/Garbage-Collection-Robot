# detector/yolo_model.py
from ultralytics import YOLO

# Đường dẫn dưới đây cần chính xác theo vị trí file của bạn.
model = YOLO("./yolov11.pt")
def predict_image(image):
    """
    Hàm xử lý ảnh với model YOLOv11 và trả về kết quả dưới dạng JSON.
    :param image: Ảnh đầu vào (PIL Image hoặc định dạng mà model chấp nhận).
    :return: Kết quả dự đoán dưới dạng JSON.
    """
    results = model(image)
    # Lấy kết quả từ prediction đầu tiên, chuyển sang dạng JSON
    return results[0].tojson()
