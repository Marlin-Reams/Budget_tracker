// sendPush.mjs
import admin from "firebase-admin";
import fs from "fs";

// Read the service account key
const serviceAccount = JSON.parse(fs.readFileSync("./service-account-key.json", "utf8"));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Replace with your actual device/browser token from the front-end
const fcmToken = 'eEM2HMFHhh2mMwdrnPmlu5:APA91bEWKBce9Mwdv30yYfMOCb3at_tX8hPT798BuZ_0B8u3gmPwhKibtwnqYpNb1kBS_fzoZUkm8Wx7kmrNvce2nBZqDphT1ZMpBChXm9lWU9_foZyZK_4';

const message = {
  notification: {
    title: "Test Notification",
    body: "This is a test push message!"
  },
  token: fcmToken
};

admin.messaging().send(message)
  .then(response => {
    console.log("✅ Successfully sent message:", response);
  })
  .catch(error => {
    console.error("❌ Error sending message:", error);
  });
