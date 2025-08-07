// DOM elements
const chat = document.getElementById('chat');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing');
const API_URL = '/query'; // This will work for both local and deployed

// Chat state
let isTyping = false;
let messageHistory = [];

// Initialize chat
document.addEventListener('DOMContentLoaded', function() {
    input.focus();
    addWelcomeMessage();
});

// Add welcome message
function addWelcomeMessage() {
    // Welcome message is already in HTML
}

// Show typing indicator
function showTyping() {
    if (!isTyping) {
        isTyping = true;
        typingIndicator.style.display = 'flex';
        chat.scrollTop = chat.scrollHeight;
    }
}

// Hide typing indicator
function hideTyping() {
    isTyping = false;
    typingIndicator.style.display = 'none';
}

// Add message to chat
function addMessage(sender, text, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (sender === 'user') {
        avatar.innerHTML = '<i class="fas fa-user"></i>';
    } else {
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
    }
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    if (isError) {
        content.innerHTML = `<div class="error-message">❌ ${text}</div>`;
    } else {
        content.innerHTML = text;
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
    
    // Add to history
    messageHistory.push({ sender, text, timestamp: new Date() });
}

// Send message to API
async function sendMessage() {
    const question = input.value.trim();
    if (!question || isTyping) return;

    // Add user message
    addMessage('user', question);
    input.value = '';
    
    // Disable input while processing
    input.disabled = true;
    sendBtn.disabled = true;
    
    // Show typing indicator
    showTyping();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: question })
        });

        const data = await response.json();
        
        // Hide typing indicator
        hideTyping();
        
        if (response.ok && data.status === 'success') {
            addMessage('bot', data.answer);
        } else {
            addMessage('bot', `Sorry, I encountered an error: ${data.error || 'Unknown error'}`, true);
        }
    } catch (error) {
        hideTyping();
        addMessage('bot', '❌ Connection error. Please check if the server is running.', true);
        console.error('Error:', error);
    } finally {
        // Re-enable input
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    }
}

// Enhanced input handling
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Send button click
sendBtn.addEventListener('click', sendMessage);

// Input focus effects
input.addEventListener('focus', () => {
    input.parentElement.style.borderColor = '#667eea';
});

input.addEventListener('blur', () => {
    input.parentElement.style.borderColor = '#e5e7eb';
});

// Auto-resize input (if needed for multi-line)
input.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});

// Add some interactive features
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
    
    // Escape to clear input
    if (e.key === 'Escape') {
        input.value = '';
        input.blur();
    }
});

// Add smooth scrolling
function smoothScrollToBottom() {
    chat.scrollTo({
        top: chat.scrollHeight,
        behavior: 'smooth'
    });
}

// Update scroll behavior
const originalAddMessage = addMessage;
addMessage = function(sender, text, isError = false) {
    originalAddMessage(sender, text, isError);
    setTimeout(smoothScrollToBottom, 100);
};

// Add connection status indicator
function updateConnectionStatus(isConnected) {
    const statusIndicator = document.querySelector('.status-indicator');
    if (isConnected) {
        statusIndicator.style.background = '#4ade80';
        statusIndicator.style.animation = 'pulse 2s infinite';
    } else {
        statusIndicator.style.background = '#ef4444';
        statusIndicator.style.animation = 'none';
    }
}

// Test connection on load
window.addEventListener('load', async () => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: 'test' })
        });
        updateConnectionStatus(response.ok);
    } catch (error) {
        updateConnectionStatus(false);
    }
});
