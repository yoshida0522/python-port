import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // apiKey: "AIzaSyCqvCMx9LRqNEmy7rbJmill6mfVIGGS9Kc",
  // authDomain: "python-port-f1079.firebaseapp.com",
  // projectId: "python-port-f1079",
  // storageBucket: "python-port-f1079.firebasestorage.app",
  // messagingSenderId: "461499464244",
  // appId: "1:461499464244:web:2f3fff5590cedeffdba861",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_URL,
  authDomain: process.env.NEXT_PUBLIC_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

export { firebaseApp, auth };
