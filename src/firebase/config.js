import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7czGfEzmsMDxGeFSqbeBZWYClbLH3pM8",
  authDomain: "satysfingyou.firebaseapp.com",
  projectId: "satysfingyou",
  storageBucket: "satysfingyou.firebasestorage.app",
  messagingSenderId: "565007652707",
  appId: "1:565007652707:web:1617b2f8e3eebbd724e556"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {auth, db}