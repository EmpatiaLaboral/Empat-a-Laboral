// passwordUtils.js

export function togglePasswordVisibility(passwordFieldId) {
    const passwordField = document.getElementById(passwordFieldId);
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
}

document.querySelectorAll('.toggle-password').forEach(toggleIcon => {
    toggleIcon.addEventListener('click', () => {
        const passwordFieldId = toggleIcon.getAttribute('onclick').match(/'([^']+)'/)[1];
        togglePasswordVisibility(passwordFieldId);
    });
});

// SEO Helper Script - Mejora de Metadatos para Funciones de Contraseñas
document.addEventListener("DOMContentLoaded", function () {
    // Añadir meta descripción específica si no existe
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        const newMetaDescription = document.createElement("meta");
        newMetaDescription.name = "description";
        newMetaDescription.content = "Administra tus contraseñas de forma segura en Empatía Laboral. Aprende cómo proteger tus datos y mejorar tu experiencia en nuestra plataforma.";
        document.head.appendChild(newMetaDescription);
    }

    // Añadir palabras clave específicas si no existen
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        const newMetaKeywords = document.createElement("meta");
        newMetaKeywords.name = "keywords";
        newMetaKeywords.content = "contraseñas seguras, visibilidad de contraseñas, seguridad, gestión de datos, empatía laboral";
        document.head.appendChild(newMetaKeywords);
    }

    // Cambiar dinámicamente el título cuando se interactúa con campos de contraseñas
    const originalTitle = document.title;
    const passwordFields = document.querySelectorAll("input[type='password']");
    passwordFields.forEach(field => {
        field.addEventListener("focus", () => {
            document.title = "Introducir Contraseña | Empatía Laboral";
        });
        field.addEventListener("blur", () => {
            document.title = originalTitle;
        });
    });
});
