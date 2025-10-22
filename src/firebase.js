// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const api = import.meta.VITE_FIREBASE_API;
const firebaseConfig = {
  apiKey: api,
  authDomain: "geminitaskgeneralizer.firebaseapp.com",
  projectId: "geminitaskgeneralizer",
  storageBucket: "geminitaskgeneralizer.firebasestorage.app",
  messagingSenderId: "1046727287567",
  appId: "1:1046727287567:web:998a6f5f6ac4d09878147a",
  measurementId: "G-SQ28N2RT8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);