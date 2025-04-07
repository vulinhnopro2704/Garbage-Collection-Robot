# 🤖 Robot Tự Động Nhặt và Phân Loại Rác

![Robot Logo](https://img.shields.io/badge/PBL%205-IoT%20%2B%20AI-brightgreen)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20Web-blue.svg)

## 📑 Tổng Quan Dự Án

Dự án PBL 5 tập trung vào phát triển robot thông minh có khả năng tự động nhặt và phân loại rác thải, sử dụng kết hợp công nghệ IoT và trí tuệ nhân tạo. Robot được trang bị model phân loại YOLOv11 Medium Object Detection để nhận diện 5 loại rác phổ biến và xử lý phù hợp. Dự án bao gồm ứng dụng di động, web tracking và hệ thống nhúng trên robot.

## ✨ Tính Năng Chính

-   🔍 **Nhận diện và phân loại 5 loại rác**:
    -   Giấy
    -   Túi ni lông
    -   Thủy tinh
    -   Chai nhựa
    -   Lon kim loại
-   📱 **Ứng dụng di động** (Android):
    -   Theo dõi hoạt động của robot theo thời gian thực
    -   Xem lịch sử phân loại và nhặt rác
    -   Nhận thông báo khi robot phát hiện vật liệu nguy hiểm (thủy tinh)
-   🌐 **Web tracking**:
    -   Giám sát trạng thái hoạt động
    -   Thống kê và báo cáo dữ liệu
    -   Truy xuất lịch sử hoạt động

## 🔧 Công Nghệ Sử Dụng

### AI & Computer Vision

-   **YOLOv11 Medium Object Detection**: Model nhận diện và phân loại rác
-   **Python**: Ngôn ngữ lập trình chính cho xử lý AI

### IoT & Embedded Systems

-   **Raspberry Pi 3B**: Máy tính nhúng điều khiển robot
-   **Python**: Điều khiển các cảm biến và chức năng của robot

### Mobile Application

-   **Expo**: Framework phát triển ứng dụng
-   **React Native**: Framework JavaScript cho ứng dụng di động

### Backend & Services

-   **Django**: Framework Python cho backend server
-   **Firebase**: Dịch vụ realtime database, authentication và cloud messaging

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Robot (RPi 3B) │◄────┤ Django Server │◄────┤ Mobile/Web Client│
│  - AI Model     │────►│ - Firebase    │────►│ - React Native   │
│  - Python       │     │ - Model Host  │     │ - Expo           │
└─────────────────┘     └──────────────┘     └──────────────────┘
```

## 📲 Cài Đặt & Thiết Lập

### Ứng Dụng Di Động

```bash
# Clone repository
git clone https://github.com/your-username/trash-sorting-robot.git

# Di chuyển vào thư mục mobile_app
cd trash-sorting-robot/mobile_app

# Cài đặt các dependencies
npm install

# Khởi chạy ứng dụng
expo start
```

### Server

```bash
# Di chuyển vào thư mục server
cd trash-sorting-robot/server

# Cài đặt các dependencies
pip install -r requirements.txt

# Khởi chạy server
python manage.py runserver
```

### Robot (Raspberry Pi)

```bash
# Di chuyển vào thư mục robot
cd trash-sorting-robot/robot

# Cài đặt các dependencies
pip install -r requirements.txt

# Chạy chương trình chính
python main.py
```

## 👨‍👨‍👦 Thành Viên Nhóm

| Họ và Tên          | Liên Hệ                                      |
| ------------------ | -------------------------------------------- |
| **Trương Vũ Linh** | [GitHub](https://github.com/vulinhnopro2704) |
| **Hoàng Văn Đạt**  | [GitHub](https://github.com/hoangdat6)       |
| **Đỗ Văn Tuấn**    | [GitHub](https://github.com/dotuangv)        |

> Sinh viên năm 3, Trường Đại học Bách Khoa - Đại học Đà Nẵng

## 📸 Demo & Screenshots

### Robot

![Robot Demo](https://via.placeholder.com/600x300?text=Robot+Demo+Image)

### Ứng Dụng Di Động

![Mobile App](https://via.placeholder.com/250x500?text=Mobile+App+Screenshot)

### Web Interface

![Web Interface](https://via.placeholder.com/800x400?text=Web+Interface+Screenshot)

## 🔮 Phát Triển Tương Lai

-   [ ] Cải thiện độ chính xác của model AI
-   [ ] Thêm khả năng phân loại nhiều loại rác hơn
-   [ ] Tối ưu hóa tiêu thụ năng lượng của robot
-   [ ] Phát triển ứng dụng iOS
-   [ ] Tích hợp với hệ thống quản lý chất thải thông minh

## 📄 Giấy Phép

Dự án này được phân phối theo giấy phép MIT. Xem tệp `LICENSE` để biết thêm thông tin.

---

Dự án được phát triển như một phần của khóa học PBL 5 tại Đại học Bách Khoa - Đại học Đà Nẵng.
