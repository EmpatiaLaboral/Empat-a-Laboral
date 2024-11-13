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

// Archivo de UI para el chat
function sanitizeInput(input) {
    const element = document.createElement('div');
    element.textContent = input;
    return element.innerHTML;
}

function handleSendButtonClick(chatManager) {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const errorContainer = document.getElementById('error-container');
    const message = messageInput.value.trim();
    const maxMessageLength = 200;
    const username = localStorage.getItem('usuarioActual') || 'Anónimo';

    if (message.length > maxMessageLength) {
        errorContainer.textContent = 'El mensaje es demasiado largo. Máximo 200 caracteres.';
        errorContainer.style.display = 'block';
        setTimeout(() => { errorContainer.style.display = 'none'; }, 3000);
        return;
    }

    errorContainer.style.display = 'none';
    if (message !== '' && message.replace(/\s/g, '').length > 0) {
        chatManager.sendMessage(username, message);
        sendButton.disabled = true;
        botResponse(chatManager);
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

    const currentUser = localStorage.getItem('usuarioActual');
    if (currentUser) {
        const userAvatar = localStorage.getItem('userAvatar') || 'images/avatar_default.png';
        addOnlineUser({ name: currentUser, avatar: userAvatar });
    }
});