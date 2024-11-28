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

// SEO Helper Script - Mejora de Metadatos para Firebase
document.addEventListener("DOMContentLoaded", function () {
    // Añadir meta descripción para la integración con Firebase si no existe
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        const newMetaDescription = document.createElement("meta");
        newMetaDescription.name = "description";
        newMetaDescription.content = "Gestión de datos en Empatía Laboral con Firebase. Descubre empresas, reseñas y conecta con nuestra comunidad a través de nuestra plataforma segura.";
        document.head.appendChild(newMetaDescription);
    }

    // Añadir palabras clave específicas si no existen
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        const newMetaKeywords = document.createElement("meta");
        newMetaKeywords.name = "keywords";
        newMetaKeywords.content = "firebase, gestión de datos, empatía laboral, reseñas de empresas, mapa interactivo";
        document.head.appendChild(newMetaKeywords);
    }

    // Cambiar dinámicamente el título de la página según las acciones de Firebase
    const originalTitle = document.title;
    if (window.db) {
        window.db.collection("reviews").onSnapshot(snapshot => {
            const reviewCount = snapshot.size || 0;
            document.title = `Reseñas disponibles: ${reviewCount} | Empatía Laboral`;
        });
    }
});
