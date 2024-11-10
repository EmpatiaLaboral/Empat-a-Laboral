const fs = require('fs');
const path = require('path');

// Función para verificar la existencia de un archivo
function fileExists(filePath) {
    return fs.promises.access(filePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);
}

// Función para cargar y evaluar un archivo JavaScript
async function loadScript(filePath) {
    if (await fileExists(filePath)) {
        try {
            const script = require(filePath);
            console.log(`El archivo ${filePath} se cargó correctamente.`);
        } catch (error) {
            console.error(`Error al cargar el archivo ${filePath}:`, error);
        }
    } else {
        console.error(`Error: El archivo ${filePath} no existe.`);
    }
}

// Función para cargar y evaluar un archivo CSS
async function loadCSS(filePath) {
    if (await fileExists(filePath)) {
        try {
            const cssContent = await fs.promises.readFile(filePath, 'utf8');
            console.log(`El archivo ${filePath} se cargó correctamente.`);
        } catch (error) {
            console.error(`Error al cargar el archivo ${filePath}:`, error);
        }
    } else {
        console.error(`Error: El archivo ${filePath} no existe.`);
    }
}

// Función para verificar la existencia de elementos en el DOM
function checkElement(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        console.log(`El/Los elemento(s) ${selector} se encontraron correctamente.`);
    } else {
        console.error(`Error: El/Los elemento(s) ${selector} no se encontraron.`);
    }
}

// Función para verificar la carga de imágenes
function checkImages() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        img.addEventListener('load', () => {
            console.log(`La imagen con src ${img.src} se cargó correctamente.`);
        });
        img.addEventListener('error', () => {
            console.error(`Error: La imagen con src ${img.src} no se pudo cargar.`);
        });
    });
}

// Función para verificar la carga de scripts
function checkScripts() {
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script) => {
        script.addEventListener('error', () => {
            console.error(`Error: El script con src ${script.src} no se pudo cargar.`);
        });
    });
}

// Función para verificar la carga de estilos
function checkStyles() {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach((link) => {
        link.addEventListener('error', () => {
            console.error(`Error: El archivo CSS con href ${link.href} no se pudo cargar.`);
        });
    });
}

// Función para verificar el envío de mensajes en el chat
function checkSendMessage() {
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.getElementById('messages');

    if (!sendButton || !messageInput || !messagesContainer) {
        console.error('Error: No se encontraron los elementos necesarios para enviar mensajes.');
        return;
    }

    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText === '') {
            console.error('Error: El mensaje está vacío.');
            return;
        }

        const messageElement = document.createElement('div');
        messageElement.textContent = messageText;
        messageElement.classList.add('message');
        messagesContainer.appendChild(messageElement);
        messageInput.value = ''; // Limpiar el input
        console.log('Mensaje enviado:', messageText);
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const messageText = messageInput.value.trim();
            if (messageText === '') {
                console.error('Error: El mensaje está vacío.');
                return;
            }

            const messageElement = document.createElement('div');
            messageElement.textContent = messageText;
            messageElement.classList.add('message');
            messagesContainer.appendChild(messageElement);
            messageInput.value = ''; // Limpiar el input
            console.log('Mensaje enviado:', messageText);
        }
    });
}

// Ejemplo de uso
(async () => {
    await loadScript('./index.js');
    await loadScript('./authentication.js');
    await loadCSS('./styles.css');
    document.addEventListener('DOMContentLoaded', () => {
        checkElement('#chat-container');
        checkElement('#toggle-chat');
        checkElement('#message-input');
        checkElement('#send-button');
        checkElement('#user-list');

        // Verificar la carga de imágenes, scripts y estilos
        checkImages();
        checkScripts();
        checkStyles();

        // Verificar el envío de mensajes en el chat
        checkSendMessage();
    });
})();