import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { addDoc, collection, onSnapshot, serverTimestamp, query, orderBy, limit, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


function loadMessages(chatManager) {
    const maxMessages = 100;  // Límite de mensajes que se mantendrán en el chat
    const q = query(collection(db, "chatMessages"), orderBy("timestamp"), limit(maxMessages));
    onSnapshot(q, (snapshot) => {
        chatManager.messagesContainer.innerHTML = ""; // Limpiar mensajes previos
        snapshot.forEach((doc) => {
            const data = doc.data();
            chatManager.displayMessage(data.username, data.message);
        });

        // Eliminar mensajes antiguos si se supera el límite
        if (snapshot.size >= maxMessages) {
            snapshot.docs.slice(0, snapshot.size - maxMessages).forEach((doc) => {
                deleteDoc(doc.ref);
            });
        }
    });
}




class ChatManager {
    constructor(messagesContainer) {
        this.messagesContainer = messagesContainer;
    }

    async sendMessage(username, message, isBot = false) {
        message = sanitizeInput(message);
        await addDoc(collection(db, "chatMessages"), {
            username: username,
            message: message,
            isBot: isBot,
            timestamp: serverTimestamp()
        });
    }

    displayMessage(username, message, isBot = false) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-wrapper');
        messageWrapper.innerHTML = `<strong>${username}:</strong> ${message}`;
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

// Archivo de UI para el chat
function sanitizeInput(input) {
    const element = document.createElement('div');
    element.textContent = input;
    return element.innerHTML;
}

function handleSendButtonClick(chatManager) {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    const username = auth.currentUser && auth.currentUser.displayName ? auth.currentUser.displayName : "Invitado";

    if (message) {
        chatManager.sendMessage(username, message);
        messageInput.value = '';
    }
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
            const typingUser = auth.currentUser ? (auth.currentUser.displayName || "Invitado") : "Invitado";
            if (messageInput.value.trim().length > 0) {
                showUserTyping(typingUser);
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

    const currentUser = auth.currentUser ? (auth.currentUser.displayName || "Invitado") : "Invitado";
    if (currentUser) {
        const userAvatar = localStorage.getItem('userAvatar') || 'images/avatar_default.png';
        addOnlineUser({ name: currentUser, avatar: userAvatar });
    }

    loadMessages(chatManager);
});