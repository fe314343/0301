importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAjjkrPrHBsoYuazfHlS4DwclksIw5SYYk",
  authDomain: "baiyang-co.firebaseapp.com",
  projectId: "baiyang-co",
  storageBucket: "baiyang-co.firebasestorage.app",
  messagingSenderId: "744052473577",
  appId: "1:744052473577:web:ee5b767dfde9438af67a78",
  measurementId: "G-8CF9E1E98E"
};

try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
} catch (e) {
    console.error("Firebase init failed in SW", e);
}

const CACHE_NAME = 'cz-smart-v23';

// 安裝時 (移除強制快取，避免跨域資源阻擋整個 PWA 啟動)
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

// 啟動時清理舊快取
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // 簡化版的網路連線優先，避免阻擋 API 或 Firebase
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

// 監聽推播訊息
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: '新公告', body: '崇正國樂團有新的內容！' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      data: { url: './index.html' }
    })
  );
});

// 點擊通知開合 App
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});
