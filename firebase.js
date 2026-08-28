import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5i31INVtqHi9bO2ar4NllgySqgpooZ_8",
  authDomain: "trynstyle-9e676.firebaseapp.com",
  projectId: "trynstyle-9e676",
  storageBucket: "trynstyle-9e676.firebasestorage.app",
  messagingSenderId: "500141154122",
  appId: "1:500141154122:android:062a11e0f09c3482c2abb3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
