// firestore.js

// Firebase Initialization
const firebaseConfig = {
    apiKey: "AIzaSyA4Xce1-nW6TfIKAr0ySALO6S65JbopKZA",
    authDomain: "btc-miner9.firebaseapp.com",
    databaseURL: "https://btc-miner9-default-rtdb.firebaseio.com",
    projectId: "btc-miner9",
    storageBucket: "btc-miner9.firebasestorage.app",
    messagingSenderId: "800335710058",
    appId: "1:800335710058:web:b3661e9033a6c58ae98713"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Add Data Function
async function addData() {
    try {
        const docRef = await db.collection("users").add({
            name: "John Doe",
            email: "john@example.com",
            age: 25,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

// Retrieve Data Function
async function getData() {
    const querySnapshot = await db.collection("users").get();
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
}

// Call functions (example)
addData();
getData();
