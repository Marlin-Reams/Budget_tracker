// src/hooks/useNotificationSetup.js
import { useEffect } from "react";
import { getToken } from "firebase/messaging";
import { messaging, db, VAPID_KEY } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const useNotificationSetup = (teammateId) => {
  useEffect(() => {
    if (!teammateId) return;

    const setupNotifications = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("🔒 Notification permission not granted.");
          return;
        }

        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

        const fcmToken = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (fcmToken) {
          console.log("✅ FCM Token:", fcmToken);
          await setDoc(
            doc(db, "fcm_tokens", teammateId),
            { fcmToken },
            { merge: true }
          );
          console.log(`✅ Token saved under teammate ID: ${teammateId}`);
        } else {
          console.warn("⚠️ No FCM token received.");
        }
      } catch (error) {
        console.error("❌ Error getting/saving FCM token:", error);
      }
    };

    setupNotifications();
  }, [teammateId]);
};

export default useNotificationSetup;


