import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFduUtLq0dA3gibeZE2S5JNzbnTHyKyg0",
  authDomain: "advwebpj1.firebaseapp.com",
  projectId: "advwebpj1",
  storageBucket: "advwebpj1.appspot.com",
  messagingSenderId: "951566198804",
  appId: "1:951566198804:web:1ed0892cdc8fb7b761df01",
  measurementId: "G-75KKZT1FQE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fs = getFirestore(app);
const storage = getStorage(app);

export { auth, fs, storage };