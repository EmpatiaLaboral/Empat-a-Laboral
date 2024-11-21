// Archivo de lógica de negocio para el chat
class ChatManager {
    constructor(messagesContainer) {
        this.messagesContainer = messagesContainer;
    }

    sendMessage(username, message, isBot = false) {
        message = sanitizeInput(message);
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-wrapper');

        const usernameElement = document.createElement('div');
        usernameElement.textContent = `${username}:`;
        usernameElement.classList.add('username');

        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.classList.add('message');
        if (isBot) {
            messageElement.classList.add('bot-message');
        }

        messageWrapper.appendChild(usernameElement);
        messageWrapper.appendChild(messageElement);
        this.messagesContainer.appendChild(messageWrapper);

        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTo({ top: this.messagesContainer.scrollHeight, behavior: 'smooth' });
    }

    showBotTyping() {
        const typingElement = document.createElement('div');
        typingElement.textContent = 'Bot está escribiendo...';
        typingElement.classList.add('typing');
        this.messagesContainer.appendChild(typingElement);
        this.scrollToBottom();
        return typingElement;
    }
}

// Referencia a la colección "chatroom"
const chatRoomRef = db.collection('chatroom');

// Escuchar mensajes en tiempo real
chatRoomRef.orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
            const { username, message } = change.doc.data();
            const messageId = change.doc.id; // ID único del mensaje en Firestore
            
            // Verifica si el mensaje ya fue procesado
            if (!processedMessages.has(messageId)) {
                processedMessages.add(messageId); // Marca el mensaje como procesado
                const chatManager = new ChatManager(document.getElementById('messages'));
                chatManager.sendMessage(username, message); // Añade el mensaje a la UI
            }
        }
    });
});

const processedMessages = new Set();

// Archivo de UI para el chat
function sanitizeInput(input) {
    const element = document.createElement('div');
    element.textContent = input;
    return element.innerHTML;
}

function handleSendButtonClick() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message === "") {
        alert("No puedes enviar un mensaje vacío.");
        return;
    }

    const username = localStorage.getItem("usuarioActual") || "Anónimo";
    const chatManager = new ChatManager(document.getElementById('messages'));

    // Guardar el mensaje en Firestore
    db.collection('chatroom').add({
        username: username,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("Mensaje guardado en Firestore.");
    }).catch((error) => {
        console.error("Error al guardar el mensaje en Firestore:", error);
    });

    messageInput.value = ""; // Limpiar el campo de entrada
}


function showUserTyping(username) {
    const typingIndicator = document.getElementById('user-typing-indicator');
    typingIndicator.textContent = `${username} está escribiendo...`;
    typingIndicator.style.display = 'block';
}

function hideUserTyping() {
    const typingIndicator = document.getElementById('user-typing-indicator');
    typingIndicator.style.display = 'none';
}

function handleMessageInputKeyPress(event, chatManager) {
    if (event.key === 'Enter') {
        hideUserTyping();
        handleSendButtonClick(chatManager);
    }
}

async function botResponse(chatManager) {
    const botMessages = [
        "Hola, ¿cómo estás?",
        "¿Qué tal tu día?",
        "¿Has visto la última película?",
        "¿Qué planes tienes para el fin de semana?",
        "¡Me encanta este chat!"
    ];

    const message = botMessages[Math.floor(Math.random() * botMessages.length)];
    const typingElement = chatManager.showBotTyping();

    await new Promise(resolve => setTimeout(resolve, 1000));
    typingElement.remove();
    chatManager.sendMessage('Bot', message, true);
    document.getElementById('send-button').disabled = false;
}

let onlineUsersContainer;
let onlineUsersCountElement;

let onlineUsers = [
    { name: 'Usuario 1', avatar: 'images/avatar1.png' },
    { name: 'Usuario 2', avatar: 'images/avatar2.png' },
    { name: 'Usuario 3', avatar: 'images/avatar3.png' },
    { name: 'Usuario 4', avatar: 'images/avatar4.png' }
];

function displayOnlineUsers() {
    if (!onlineUsersContainer) return;

    onlineUsersContainer.innerHTML = '';
    onlineUsers.forEach(user => {
        const userElement = document.createElement('li');
        userElement.innerHTML = `
            <img src="${user.avatar}" alt="${user.name}">
            <span>${user.name}</span>
        `;
        onlineUsersContainer.appendChild(userElement);
    });
    updateOnlineUsersCount();
}

function addOnlineUser(user) {
    onlineUsers.push(user);
    displayOnlineUsers();
}

// Función para actualizar el contador de usuarios conectados
function updateOnlineUsersCount() {
    const onlineUsersCount = onlineUsersContainer ? onlineUsersContainer.getElementsByTagName('li').length : 0;
    onlineUsersCountElement.textContent = `Usuarios conectados: ${onlineUsersCount}`;
}

// Centralizar las variables seleccionadas del DOM
document.addEventListener('DOMContentLoaded', () => {
    onlineUsersContainer = document.getElementById('online-users');
    onlineUsersCountElement = document.getElementById('online-users-count');
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.getElementById('messages');
    const errorContainer = document.createElement('div');
    errorContainer.id = 'error-container';
    errorContainer.style.display = 'none';
    errorContainer.classList.add('error-message');
    messagesContainer.parentElement.insertBefore(errorContainer, messagesContainer);

    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'user-typing-indicator';
    typingIndicator.style.display = 'none';
    typingIndicator.classList.add('typing-indicator');
    messagesContainer.parentElement.insertBefore(typingIndicator, messagesContainer);

    const chatManager = new ChatManager(messagesContainer);

    

    if (sendButton && messageInput) {
        messageInput.addEventListener('input', () => {
            sendButton.disabled = messageInput.value.trim().length === 0;
            if (messageInput.value.trim().length > 0) {
                showUserTyping(localStorage.getItem('usuarioActual') || 'Anónimo');
            } else {
                hideUserTyping();
            }
        });
        sendButton.disabled = true;

        sendButton.addEventListener('click', () => handleSendButtonClick(chatManager));
        messageInput.addEventListener('focus', () => {
            messageInput.addEventListener('keypress', (event) => handleMessageInputKeyPress(event, chatManager));
        });
        messageInput.addEventListener('blur', () => {
            messageInput.removeEventListener('keypress', (event) => handleMessageInputKeyPress(event, chatManager));
        });
    }

    displayOnlineUsers();

    const username = localStorage.getItem("usuarioActual") || "Anónimo"; // Define un valor predeterminado


    const currentUser = localStorage.getItem('usuarioActual');
    if (currentUser) {
        const userAvatar = localStorage.getItem('userAvatar') || 'images/avatar_default.png';
        addOnlineUser({ name: currentUser, avatar: userAvatar });
    }
    
    db.collection('onlineUsers').doc(username).set({ online: true });
    db.collection('onlineUsers').doc(username).delete();
    db.collection('onlineUsers').onSnapshot((snapshot) => {
        const onlineUsers = [];
        snapshot.forEach((doc) => {
            onlineUsers.push(doc.id);
        });
        displayOnlineUsers(onlineUsers); // Función para actualizar la lista de usuarios en línea en la UI
    });
    
    let isListenerRegistered = false;


    // SEO Helper Script - Mejora de Metadatos para el Chat
document.addEventListener("DOMContentLoaded", function () {
    // Añadir meta descripción específica si no existe
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        const newMetaDescription = document.createElement("meta");
        newMetaDescription.name = "description";
        newMetaDescription.content = "Participa en el chat en vivo de Empatía Laboral. Conecta con otros usuarios, comparte ideas y descubre empresas destacadas por su trato justo.";
        document.head.appendChild(newMetaDescription);
    }

    // Añadir palabras clave relevantes si no existen
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        const newMetaKeywords = document.createElement("meta");
        newMetaKeywords.name = "keywords";
        newMetaKeywords.content = "chat en vivo, empatía laboral, conexión usuarios, empresas, trato justo, reseñas laborales";
        document.head.appendChild(newMetaKeywords);
    }

    // Cambiar dinámicamente el título según la actividad del chat
    const originalTitle = document.title;
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
        const observer = new MutationObserver(() => {
            const lastMessage = messagesContainer.lastElementChild;
            if (lastMessage) {
                const username = lastMessage.querySelector('.username')?.textContent || "Usuario";
                const messagePreview = lastMessage.querySelector('.message')?.textContent || "Nuevo mensaje";
                document.title = `Chat: ${username} dice "${messagePreview}" | Empatía Laboral`;
            } else {
                document.title = originalTitle;
            }
        });

        observer.observe(messagesContainer, { childList: true });
    }
});

   
    

});
