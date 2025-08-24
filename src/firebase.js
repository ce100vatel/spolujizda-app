// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// konfigurace převzatá z Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAztn42UoGye0yo77bJvfPAVz9ON3O_e0Y",
  authDomain: "spolujizda-c4aca.firebaseapp.com",
  projectId: "spolujizda-c4aca",
  storageBucket: "spolujizda-c4aca.firebasestorage.app",
  messagingSenderId: "186558191811",
  appId: "1:186558191811:web:d6765b15ba888ce5352a76",
  measurementId: "G-8DFS4YFR06"
};

// inicializace
const app = initializeApp(firebaseConfig);

// export Firestore databáze
export const db = getFirestore(app);
