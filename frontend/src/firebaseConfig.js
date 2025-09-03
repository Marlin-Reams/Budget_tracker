// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATAtZHlynER5sNcPdrg8C1ucyCFs9sGms",
  authDomain: "budget-tracker-f1b96.firebaseapp.com",
  projectId: "budget-tracker-f1b96",
  storageBucket: "budget-tracker-f1b96.appspot.com",
  messagingSenderId: "436658163930",
  appId: "1:436658163930:web:56d84788fa3e56e8cd95e3",

};

const VAPID_KEY = "BMZdBJzRSEXsyHVx-wuQBaYL5XTOgABcglrWcoaZZhEbQ_iGDInr0EUCoC_MmhVmBi0r9Dw_YobrORRcAyLAn1s";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { auth, db, messaging, getToken, onMessage, VAPID_KEY };
