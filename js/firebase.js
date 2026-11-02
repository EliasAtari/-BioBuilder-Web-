
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAEFNpPWImAAR1Ja9LxqpM3vZmUKesdF9Q",
    authDomain: "biobuilder-web.firebaseapp.com",
    projectId: "biobuilder-web",
    storageBucket: "biobuilder-web.firebasestorage.app",
    messagingSenderId: "950823188466",
    appId: "1:950823188466:web:83eb042b1c6f0995c4dd6b"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const proveedorGoogle = new GoogleAuthProvider();

const db = getFirestore(app);

window.firebaseApp = app;
window.firebaseAuth = auth;
window.proveedorGoogle = proveedorGoogle;
window.firebaseDB = db;

console.log("Firebase conectado correctamente.");
