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

    // SEO Helper Script - Mejora de Metadatos para Diagnóstico
document.addEventListener("DOMContentLoaded", function () {
    // Añadir meta descripción si no existe
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        const newMetaDescription = document.createElement("meta");
        newMetaDescription.name = "description";
        newMetaDescription.content = "Herramienta de diagnóstico para Empatía Laboral. Verifica la carga de scripts, imágenes y estilos para garantizar un funcionamiento óptimo.";
        document.head.appendChild(newMetaDescription);
    }

    // Añadir palabras clave específicas si no existen
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        const newMetaKeywords = document.createElement("meta");
        newMetaKeywords.name = "keywords";
        newMetaKeywords.content = "diagnóstico, depuración, scripts, imágenes, estilos, empatía laboral";
        document.head.appendChild(newMetaKeywords);
    }

    // Cambiar dinámicamente el título según el resultado del diagnóstico
    const originalTitle = document.title;
    const diagnosticSummary = document.createElement('div');
    diagnosticSummary.id = 'diagnostic-summary';
    diagnosticSummary.style.display = 'none';
    document.body.appendChild(diagnosticSummary);

    const observer = new MutationObserver(() => {
        const errors = diagnosticSummary.querySelectorAll('.error').length;
        const warnings = diagnosticSummary.querySelectorAll('.warning').length;

        if (errors > 0) {
            document.title = `Errores detectados (${errors}) | Empatía Laboral`;
        } else if (warnings > 0) {
            document.title = `Advertencias detectadas (${warnings}) | Empatía Laboral`;
        } else {
            document.title = `Diagnóstico limpio | Empatía Laboral`;
        }
    });

    observer.observe(diagnosticSummary, { childList: true, subtree: true });
});

})();