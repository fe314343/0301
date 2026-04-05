importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

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

    // v39: 使用確後的相容版背景訊息處理器
    messaging.setBackgroundMessageHandler(function(payload) {
        console.log('[SW] 背景訊息收到: ', payload);
        const title = payload.notification?.title || payload.data?.title || '新公告';
        const options = {
            body: payload.notification?.body || payload.data?.body || '崇正國樂團有新內容！',
            icon: 'icon-192.png',
            badge: 'icon-192.png',
            data: { url: './index.html' }
        };
        return self.registration.showNotification(title, options);
    });
} catch (e) {
    console.error("Firebase init failed in SW", e);
}

const CACHE_NAME = 'cz-smart-v39';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => { if (key !== CACHE_NAME) return caches.delete(key); })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

self.addEventListener('push', event => {
  try {
      if (event.data) {
          const data = event.data.json();
          const title = data.notification?.title || data.title || '新公告';
          const options = {
              body: data.notification?.body || data.body || '崇正國樂團有新內容！',
              icon: 'icon-192.png',
              badge: 'icon-192.png',
              data: { url: './index.html' }
          };
          event.waitUntil(self.registration.showNotification(title, options));
      }
  } catch (err) {
      console.warn('[SW] Push parsing failed.');
  }
});


self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window' }).then(clientsArr => {
    if (clientsArr.length > 0) {
      clientsArr[0].focus();
      return clientsArr[0].navigate('./index.html');
    }
    return clients.openWindow('./index.html');
  }));
});

