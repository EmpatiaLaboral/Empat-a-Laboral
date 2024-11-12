// authFunctions.js

import { validateField, validateEmail, validatePasswordStrength, matchPassword } from './validation.js';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


export function openPopup(type) {
    const popup = document.getElementById('auth-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupForm = document.getElementById('popup-form');

    popupTitle.textContent = type === 'register' ? 'Registro' : 'Iniciar Sesión';
    popupForm.innerHTML = createForm(type);
    popupForm.onsubmit = type === 'register' ? handleRegister : handleLogin;

    popup.style.display = 'block';

    // Añadir evento para cerrar el pop-up al hacer clic fuera de él
    setTimeout(() => {
        document.addEventListener('click', closePopupOnClickOutside);
    }, 0);
}

function createForm(type) {
    if (type === 'register') {
        return `
            <label for="register-username">Nombre de Usuario:</label>
            <input type="text" id="register-username" name="username" required autocomplete="username">
            <label for="register-email">Email:</label>
            <input type="email" id="register-email" name="email" required autocomplete="email" oninput="window.validateField(this, window.validateEmail)">
            <label for="register-password">Contraseña:</label>
            <div class="password-container">
                <input type="password" id="register-password" name="password" required autocomplete="new-password" minlength="6" oninput="window.validatePasswordStrength(this)">
                <span class="toggle-password" onclick="togglePasswordVisibility('register-password')">👁️</span>
            </div>
            <label for="register-confirm-password">Confirmar Contraseña:</label>
            <div class="password-container">
                <input type="password" id="register-confirm-password" name="confirm-password" required autocomplete="new-password" minlength="6" oninput="window.validateField(this, window.matchPassword)">
                <span class="toggle-password" onclick="togglePasswordVisibility('register-confirm-password')">👁️</span>
            </div>
            <button type="submit">Registrarse</button>
            <div id="password-strength" style="margin-top: 5px;"></div>
        `;
    } else if (type === 'login') {
        return `
            <label for="login-email">Email:</label>
            <input type="email" id="login-email" name="email" required autocomplete="email" oninput="window.validateField(this, window.validateEmail)">
            <label for="login-password">Contraseña:</label>
            <div class="password-container">
                <input type="password" id="login-password" name="password" required autocomplete="current-password">
                <span class="toggle-password" onclick="togglePasswordVisibility('login-password')">👁️</span>
            </div>
            <button type="submit">Iniciar Sesión</button>
        `;
    }
}


async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (!validateEmail(email)) {
        displayError('El formato del correo electrónico no es válido.');
        return;
    }

    if (password !== confirmPassword) {
        displayError('Las contraseñas no coinciden.');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        closePopup();
        updateUIAfterAuth(username, true);  // Agrega el usuario a la interfaz
    } catch (error) {
        displayError('Error al registrar el usuario: ' + error.message);
    }
}



async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!validateEmail(email)) {
        displayError('El formato del correo electrónico no es válido.');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        alert('Inicio de sesión exitoso.');
        closePopup();
        updateUIAfterAuth(user.email, true);
    } catch (error) {
        displayError('Error al iniciar sesión: ' + error.message);
    }
}



export async function logout(isSwitchingUser = false) {
    try {
        await signOut(auth);
        updateUIAfterAuth(null, false);  // Actualizar la interfaz
        if (!isSwitchingUser) {
            window.location.href = '#home';
        }
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
}


function updateUserStatus(username, isLoggedIn) {
    const userStatusStr = localStorage.getItem('userStatus');
    const userStatus = userStatusStr ? JSON.parse(userStatusStr) : {};
    if (username) {
        userStatus[username] = isLoggedIn;
    } else {
        for (const user in userStatus) {
            userStatus[user] = false;
        }
    }
    localStorage.setItem('userStatus', JSON.stringify(userStatus));
    updateOnlineUsers();
}

function updateUIAfterAuth(username, isLoggedIn) {
    const loginButton = document.querySelector('.login-button');
    const registerButton = document.querySelector('.register-button');
    const logoutButton = document.querySelector('.logout-button');
    const usernameDisplay = document.getElementById('username-display');

    if (isLoggedIn) {
        if (loginButton) loginButton.style.display = 'none';
        if (registerButton) registerButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'inline-block';
        if (usernameDisplay) usernameDisplay.textContent = `Bienvenido, ${username}`;
    } else {
        if (loginButton) loginButton.style.display = 'inline-block';
        if (registerButton) registerButton.style.display = 'inline-block';
        if (logoutButton) logoutButton.style.display = 'none';
        if (usernameDisplay) usernameDisplay.textContent = '';
    }
}

function updateOnlineUsers() {
    const userStatusStr = localStorage.getItem('userStatus');
    const userStatus = userStatusStr ? JSON.parse(userStatusStr) : {};
    const onlineUsersList = document.getElementById('online-users');

    if (onlineUsersList) {
        onlineUsersList.innerHTML = '';

        for (const username in userStatus) {
            if (userStatus[username]) {
                const userItem = document.createElement('li');
                userItem.textContent = username;
                onlineUsersList.appendChild(userItem);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateOnlineUsers();
    const currentUser = localStorage.getItem('usuarioActual');
    updateUIAfterAuth(currentUser, !!currentUser);
});

function togglePasswordVisibility(passwordFieldId) {
    const passwordField = document.getElementById(passwordFieldId);
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
}

function displayError(message) {
    let errorMessage = document.getElementById('error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.id = 'error-message';
        errorMessage.style.color = 'red';
        const popupForm = document.getElementById('popup-form');
        if (popupForm) {
            popupForm.insertAdjacentElement('afterbegin', errorMessage);
        }
    }
    errorMessage.textContent = message;
}

function closePopupOnClickOutside(event) {
    const popup = document.getElementById('auth-popup');
    const popupContent = document.querySelector('.popup-content');
    if (popupContent && !popupContent.contains(event.target)) {
        closePopup();
        document.removeEventListener('click', closePopupOnClickOutside); // Remover el evento al cerrar el popup
    }
}

export function isUserLoggedIn() {
    return auth.currentUser !== null;
}


export function addCompany() {
    if (!isUserLoggedIn()) {
        alert('Debe iniciar sesión para agregar una empresa.');
        return;
    }
    // Lógica para agregar la empresa
}

window.openPopup = openPopup;
window.closePopup = closePopup;
window.validateField = validateField;
window.validateEmail = validateEmail;
window.validatePasswordStrength = validatePasswordStrength;
window.matchPassword = matchPassword;
window.togglePasswordVisibility = togglePasswordVisibility;
window.displayError = displayError;
window.logout = logout;
window.closePopupOnClickOutside = closePopupOnClickOutside;
window.isUserLoggedIn = isUserLoggedIn;
window.addCompany = addCompany;


onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUserStatus(user.email, true);
        updateUIAfterAuth(user.email, true);
    } else {
        updateUserStatus(null, false);
        updateUIAfterAuth(null, false);
    }
});
