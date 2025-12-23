# Cookie Updater - Chrome Extension

## Mô tả
Extension Chrome giúp lấy cookies `c_user` và `xs` từ Facebook và cập nhật vào file **xs_cookie.txt** trên máy tính của bạn.

## Tính năng
- 🍪 Lấy cookies `c_user` và `xs` từ Facebook
- 📄 Hiển thị thông tin cookie hiện tại (domain, c_user, xs)
- 💾 Cập nhật trực tiếp vào file **xs_cookie.txt**
- 🔄 Tự động lưu đường dẫn file đã chọn lần trước

## Cài đặt Extension cho Chrome

### Bước 1: Tải source code
- Clone hoặc tải về thư mục `chrome-cookie-extension`

### Bước 2: Cài extension vào Chrome
1. Mở trình duyệt Chrome
2. Truy cập `chrome://extensions/` (copy và paste vào thanh địa chỉ)
3. Bật **Developer mode** (góc trên bên phải)
4. Click nút **Load unpacked** (Tải tiện ích đã giải nén)
5. Chọn thư mục `chrome-cookie-extension` mà bạn vừa tải về
6. Extension sẽ xuất hiện trong danh sách và trên toolbar

### Bước 3: Ghim extension (tuỳ chọn)
- Click vào icon mảnh ghép 🧩 trên toolbar Chrome
- Tìm "Cookie Updater" và click vào icon ghim 📌

## Chuẩn bị file xs_cookie.txt

**LƯU Ý QUAN TRỌNG**: File phải có tên chính xác là **xs_cookie.txt**

1. Tạo file text với tên **xs_cookie.txt** ở vị trí bất kỳ trên máy tính
2. Nội dung file có dạng:
```
c_user=123456789
xs=abc123xyz789
```
3. Lưu file này để sử dụng sau

## Cách sử dụng

### Bước 1: Mở Facebook
- Truy cập vào trang Facebook (facebook.com)
- Đảm bảo bạn đã đăng nhập

### Bước 2: Mở Extension
- Click vào icon extension "🍪 Cookie Updater" trên toolbar
- Popup sẽ hiển thị thông tin:
  - **Domain**: facebook.com
  - **c_user**: ID Facebook của bạn
  - **xs**: Cookie session hiện tại

### Bước 3: Chọn file xs_cookie.txt

#### Button "Chọn File"
- Click nút **Chọn File**
- Duyệt và chọn file **xs_cookie.txt** trên máy tính
- Đường dẫn file sẽ hiển thị trong ô "File đích"
- Extension sẽ nhớ đường dẫn này cho lần sau

### Bước 4: Cập nhật cookie

#### Button "Cập Nhật"
- Sau khi đã chọn file, nút **Cập Nhật** sẽ được kích hoạt
- Click nút **Cập Nhật** để ghi cookies vào file **xs_cookie.txt**
- Trạng thái cập nhật sẽ hiển thị:
  - ✅ "Cập nhật thành công!" - nếu ghi file thành công
  - ❌ "Lỗi..." - nếu có lỗi xảy ra

## Giới thiệu các Button

### 🗂️ Button "Chọn File"
- **Chức năng**: Mở hộp thoại chọn file để chỉ định file **xs_cookie.txt**
- **Khi nào dùng**: Lần đầu tiên sử dụng hoặc khi muốn đổi file đích
- **Lưu ý**: Chỉ chọn file có tên **xs_cookie.txt**

### 🔄 Button "Cập Nhật"
- **Chức năng**: Ghi cookies `c_user` và `xs` vào file **xs_cookie.txt** đã chọn
- **Khi nào dùng**: Sau khi đã chọn file và muốn cập nhật cookie mới
- **Trạng thái**: 
  - Disabled (mờ) - khi chưa chọn file
  - Enabled (sáng) - khi đã chọn file, sẵn sàng cập nhật

## Cấu trúc thư mục
```
chrome-cookie-extension/
├── manifest.json      # File cấu hình extension
├── popup.html         # Giao diện popup
├── popup.js           # Logic xử lý
├── style.css          # Styling
├── icons/             # Icons cho extension
│   ├── icon16.png
│   ├── icon48.svg
│   └── icon128.svg
└── README.md          # Hướng dẫn này
```

## Lưu ý quan trọng
- ⚠️ File **PHẢI** có tên chính xác là **xs_cookie.txt**
- Extension chỉ hoạt động trên trang Facebook
- Cần quyền truy cập file system để ghi file
- Đường dẫn file được lưu tự động cho lần sử dụng tiếp theo
- Nếu cookie `c_user` hoặc `xs` không tồn tại, sẽ hiển thị "-"

## Xử lý lỗi thường gặp

### "File đích không đúng định dạng"
- Đảm bảo file có tên chính xác: **xs_cookie.txt**

### "Không tìm thấy cookie"
- Kiểm tra xem bạn đã đăng nhập Facebook chưa
- Làm mới trang Facebook và thử lại

### Button "Cập Nhật" bị mờ
- Bạn chưa chọn file, click nút "Chọn File" trước

## Tác giả
Le Minh Triet
