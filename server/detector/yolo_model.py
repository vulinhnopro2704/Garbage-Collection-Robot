# detector/yolo_model.py
from ultralytics import YOLO

# Giả sử bạn đã train và có file yolov11.pt, đặt file này ở thư mục gốc hoặc trong folder detector.
# Đường dẫn dưới đây cần chính xác theo vị trí file của bạn.
model = YOLO("../yolov11.pt")  # nếu file nằm ở thư mục gốc, bạn có thể cần đường dẫn tương đối: "../yolov11.pt"

def predict_image(image):
    """
    Hàm xử lý ảnh với model YOLOv11 và trả về kết quả dưới dạng JSON.
    :param image: Ảnh đầu vào (PIL Image hoặc định dạng mà model chấp nhận).
    :return: Kết quả dự đoán dưới dạng JSON.
    """
    results = model(image)
    # Lấy kết quả từ prediction đầu tiên, chuyển sang dạng JSON
    return results[0].tojson()
