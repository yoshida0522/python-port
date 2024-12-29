import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqvCMx9LRqNEmy7rbJmill6mfVIGGS9Kc",
  authDomain: "python-port-f1079.firebaseapp.com",
  projectId: "python-port-f1079",
  storageBucket: "python-port-f1079.firebasestorage.app",
  messagingSenderId: "461499464244",
  appId: "1:461499464244:web:2f3fff5590cedeffdba861",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

export { firebaseApp, auth };
