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