import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCd4t--XGQscpanH0j1ep1pXdIRG28JqYE",
  authDomain: "fit5032-lab-dbda4.firebaseapp.com",
  projectId: "fit5032-lab-dbda4",
  storageBucket: "fit5032-lab-dbda4.firebasestorage.app",
  messagingSenderId: "856380321202",
  appId: "1:856380321202:web:07c55a0a150baac886c8ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export default db;