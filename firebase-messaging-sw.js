// public/firebase-messaging-sw.js

// This file is required for Firebase messaging to work in the background
importScripts("https://www.gstatic.com/firebasejs/10.5.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.5.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyATAtZHlynER5sNcPdrg8C1ucyCFs9sGms",
  authDomain: "budget-tracker-f1b96.firebaseapp.com",
  projectId: "budget-tracker-f1b96",
  storageBucket: "budget-tracker-f1b96.appspot.com",
  messagingSenderId: "436658163930",
  appId: "1:436658163930:web:56d84788fa3e56e8cd95e3"
});

const messaging = firebase.messaging();

// Handle background push notification
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new message',
    icon: '/logo192.png', // Optional
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});