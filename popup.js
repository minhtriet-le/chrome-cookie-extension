// Biến lưu trữ cookies và file handle
let cUser = '';
let xsCookie = '';
let fileHandle = null;
let lastFilePath = '';

// Lấy các element
const domainEl = document.getElementById('domain');
const cuserEl = document.getElementById('cuser');
const xsEl = document.getElementById('xs');
const filePathEl = document.getElementById('filePath');
const lastFilePathEl = document.getElementById('lastFilePath');
const chooseFileBtn = document.getElementById('chooseFile');
const updateBtn = document.getElementById('updateFile');
const statusEl = document.getElementById('status');

// Hiển thị status
function showStatus(message, type = 'info') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  setTimeout(() => {
    statusEl.textContent = '';
    statusEl.className = 'status';
  }, 3000);
}

// Lưu file path vào chrome.storage.local
async function saveFilePath(path) {
  try {
    await chrome.storage.local.set({ lastFilePath: path });
    lastFilePath = path;
  } catch (error) {
    console.error('Lỗi lưu file path:', error);
  }
}

// Load file path từ chrome.storage.local
async function loadFilePath() {
  try {
    const result = await chrome.storage.local.get(['lastFilePath']);
    return result.lastFilePath || '';
  } catch (error) {
    console.error('Lỗi load file path:', error);
    return '';
  }
}

// Lấy cookies c_user và xs từ tab hiện tại
async function getCookies() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
      showStatus('Không thể lấy thông tin tab!', 'error');
      return false;
    }

    const url = new URL(tab.url);
    const domain = url.hostname;
    
    if (url.protocol === 'chrome:' || url.protocol === 'chrome-extension:') {
      showStatus('Không thể lấy cookies từ trang này!', 'error');
      return false;
    }

    domainEl.textContent = domain;

    // Lấy tất cả cookies
    let cookies = await chrome.cookies.getAll({ domain: domain });
    
    // Nếu không có, thử với domain gốc
    if (cookies.length === 0) {
      const domainParts = domain.split('.');
      if (domainParts.length > 2) {
        const rootDomain = domainParts.slice(-2).join('.');
        cookies = await chrome.cookies.getAll({ domain: rootDomain });
      }
    }

    // Tìm c_user và xs
    const cUserCookie = cookies.find(c => c.name === 'c_user');
    const xsCookie_ = cookies.find(c => c.name === 'xs');

    if (cUserCookie) {
      cUser = cUserCookie.value;
      cuserEl.textContent = cUser;
    } else {
      cuserEl.textContent = 'Không tìm thấy';
    }

    if (xsCookie_) {
      xsCookie = xsCookie_.value;
      // Hiển thị rút gọn nếu quá dài
      xsEl.textContent = xsCookie.length > 30 ? xsCookie.substring(0, 30) + '...' : xsCookie;
    } else {
      xsEl.textContent = 'Không tìm thấy';
    }

    if (cUser && xsCookie) {
      checkCanUpdate();
      return true;
    } else {
      showStatus('Không tìm thấy c_user hoặc xs cookie!', 'error');
      return false;
    }

  } catch (error) {
    showStatus('Lỗi: ' + error.message, 'error');
    return false;
  }
}

// Kiểm tra có thể update không
function checkCanUpdate() {
  if (fileHandle && cUser && xsCookie) {
    updateBtn.disabled = false;
  } else {
    updateBtn.disabled = true;
  }
}

// Chọn file
async function chooseFile() {
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [{
        description: 'Text Files',
        accept: { 'text/plain': ['.txt'] }
      }],
      multiple: false
    });
    
    fileHandle = handle;
    const fileName = handle.name;
    
    filePathEl.textContent = fileName;
    filePathEl.title = fileName;
    filePathEl.classList.add('selected');
    
    // Lưu file name để nhớ lần sau
    await saveFilePath(fileName);
    
    showStatus('✓ Đã chọn file: ' + fileName, 'success');
    checkCanUpdate();
    
  } catch (error) {
    if (error.name !== 'AbortError') {
      showStatus('Lỗi chọn file: ' + error.message, 'error');
    }
  }
}

// Update file
async function updateFile() {
  if (!fileHandle || !cUser || !xsCookie) {
    showStatus('Chưa đủ thông tin để update!', 'error');
    return;
  }

  try {
    // Đọc file
    const file = await fileHandle.getFile();
    const content = await file.text();
    
    // Tách thành các dòng
    const lines = content.split('\n');
    let found = false;
    let updatedLines = [];

    for (let line of lines) {
      if (line.trim() === '') {
        updatedLines.push(line);
        continue;
      }

      const parts = line.split(',');
      
      // Kiểm tra nếu c_user khớp (cột đầu tiên)
      if (parts.length >= 3 && parts[0].trim() === cUser) {
        // Cập nhật xs vào cột cuối cùng
        parts[parts.length - 1] = xsCookie;
        updatedLines.push(parts.join(','));
        found = true;
      } else {
        updatedLines.push(line);
      }
    }

    if (!found) {
      showStatus('Không tìm thấy c_user: ' + cUser + ' trong file!', 'error');
      return;
    }

    // Ghi lại file
    const writable = await fileHandle.createWritable();
    await writable.write(updatedLines.join('\n'));
    await writable.close();

    showStatus('Đã cập nhật xs cho c_user: ' + cUser, 'success');

  } catch (error) {
    showStatus('Lỗi update: ' + error.message, 'error');
  }
}

// Khởi tạo khi mở popup
async function initialize() {
  // Lấy cookies
  await getCookies();
  
  // Load file path đã lưu (chỉ để hiển thị)
  const savedPath = await loadFilePath();
  if (savedPath) {
    lastFilePath = savedPath;
    lastFilePathEl.textContent = '(Lần trước: ' + savedPath + ')';
    lastFilePathEl.title = savedPath; // Show full path on hover
  }
}

// Event listeners
chooseFileBtn.addEventListener('click', chooseFile);
updateBtn.addEventListener('click', updateFile);

// Tự động khởi tạo khi mở popup
document.addEventListener('DOMContentLoaded', initialize);
