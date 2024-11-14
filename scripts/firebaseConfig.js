// firebaseConfig.js
const firebaseConfig = {
    apiKey: "AIzaSyDOGqbWfkbBeHcu-jjZYNggKNXq8QMRFBI",
    authDomain: "empatia-laboral-b6595.firebaseapp.com",
    projectId: "empatia-laboral-b6595",
    storageBucket: "empatia-laboral-b6595.appspot.com",
    messagingSenderId: "632150523448",
    appId: "1:632150523448:web:ac54fcffe193c3e00030cd",
    measurementId: "G-VGE7VZRXE9"
};

// Inicializar Firebase y hacer `db` global sin `export`
const app = firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore(app);
