// Import Firebase modules (if using npm)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
``
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4Xce1-nW6TfIKAr0ySALO6S65JbopKZA",
  authDomain: "btc-miner9.firebaseapp.com",
  databaseURL: "https://btc-miner9-default-rtdb.firebaseio.com",
  projectId: "btc-miner9",
  storageBucket: "btc-miner9.firebasestorage.app",
  messagingSenderId: "800335710058",
  appId: "1:800335710058:web:b3661e9033a6c58ae98713"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
