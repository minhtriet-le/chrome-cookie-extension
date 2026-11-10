// Lưu/đọc FileSystemFileHandle trong IndexedDB.
// Dùng chung cho popup.js và picker.js (cùng origin của extension).
function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('cookie-updater', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('handles');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveHandle(handle) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('handles', 'readwrite');
    tx.objectStore('handles').put(handle, 'file');
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function loadHandle() {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const req = db.transaction('handles').objectStore('handles').get('file');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.error('Lỗi load handle:', error);
    return null;
  }
}
