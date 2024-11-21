// validation.js

export function validateField(input, validationFunction) {
    if (validationFunction(input.value)) {
        input.style.borderColor = 'green';
    } else {
        input.style.borderColor = 'red';
    }
}

export function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

export function validatePasswordStrength(input) {
    const strengthElement = document.getElementById('password-strength');
    const password = input.value;
    let strength = 'Débil';
    let color = 'red';

    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#\$%\^&\*]/.test(password)) {
        strength = 'Muy fuerte';
        color = 'green';
    } else if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        strength = 'Fuerte';
        color = 'orange';
    } else if (password.length >= 6) {
        strength = 'Moderada';
        color = 'yellow';
    }

    if (strengthElement) {
        strengthElement.textContent = `Fuerza de la contraseña: ${strength}`;
        strengthElement.style.color = color;
    }
}

export function matchPassword(input) {
    const password = document.getElementById('register-password');
    if (!password || !input || !input.value) {
        return false;
    }
    const confirmPassword = input.value;
    const isMatch = password.value === confirmPassword;

    input.style.borderColor = isMatch ? 'green' : 'red';
    return isMatch;
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (event) => {
        if (event.target.id === 'register-password') {
            validatePasswordStrength(event.target);
            const confirmPasswordInput = document.getElementById('register-confirm-password');
            if (confirmPasswordInput) {
                matchPassword(confirmPasswordInput);
            }
        } else if (event.target.id === 'register-confirm-password') {
            matchPassword(event.target);
        } else if (event.target.id === 'register-email') {
            validateField(event.target, validateEmail);
        }
    });
});

// Ensure the email field is properly validated after the initial input event
const emailField = document.getElementById('register-email');
if (emailField) {
    emailField.addEventListener('blur', (event) => {
        validateField(event.target, validateEmail);
    });
}

// SEO Helper Script - Mejora de Metadatos para Validación de Formularios
document.addEventListener("DOMContentLoaded", function () {
    // Añadir meta descripción específica si no existe
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        const newMetaDescription = document.createElement("meta");
        newMetaDescription.name = "description";
        newMetaDescription.content = "Valida tus datos de forma segura en Empatía Laboral. Asegúrate de que tu email y contraseña cumplen con los estándares más altos de seguridad.";
        document.head.appendChild(newMetaDescription);
    }

    // Añadir palabras clave específicas si no existen
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        const newMetaKeywords = document.createElement("meta");
        newMetaKeywords.name = "keywords";
        newMetaKeywords.content = "validación de formularios, seguridad, validación de contraseñas, validación de emails, empatía laboral";
        document.head.appendChild(newMetaKeywords);
    }

    // Cambiar dinámicamente el título de la página según la actividad de validación
    const originalTitle = document.title;
    const emailField = document.getElementById("register-email");
    const passwordField = document.getElementById("register-password");
    const confirmPasswordField = document.getElementById("register-confirm-password");

    [emailField, passwordField, confirmPasswordField].forEach(field => {
        if (field) {
            field.addEventListener("focus", function () {
                const fieldName = field.id.replace("register-", "").replace("-", " ");
                document.title = `Validando ${fieldName} | Empatía Laboral`;
            });

            field.addEventListener("blur", function () {
                document.title = originalTitle;
            });
        }
    });
});
