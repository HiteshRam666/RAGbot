class FinanceBot {
    constructor() {
        this.apiUrl = ''; // Use relative URL for same-domain deployment
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatForm = document.getElementById('chatForm');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Form submission
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Input validation
        this.messageInput.addEventListener('input', () => {
            this.sendButton.disabled = !this.messageInput.value.trim();
        });
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.sendButton.disabled = true;

        try {
            const response = await this.callAPI(message);
            this.addMessage(response.answer, 'bot');
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('Sorry, I encountered an error while processing your request. Please try again.', 'bot');
        }
    }

    async callAPI(message) {
        const response = await fetch(`/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'error') {
            throw new Error(data.error || 'Unknown error occurred');
        }

        return data;
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const currentTime = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">
                        <p>${this.escapeHtml(text)}</p>
                    </div>
                </div>
                <div class="message-time">${currentTime}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <i class="fas fa-robot bot-icon"></i>
                    <div class="message-text">
                        <p>${this.escapeHtml(text)}</p>
                    </div>
                </div>
                <div class="message-time">${currentTime}</div>
            `;
        }

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FinanceBot();
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add typing indicator
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // Enable/disable send button based on input
    messageInput.addEventListener('input', () => {
        sendButton.disabled = !messageInput.value.trim();
    });

    // Add smooth scrolling to chat
    const chatMessages = document.getElementById('chatMessages');
    const observer = new MutationObserver(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
    observer.observe(chatMessages, { childList: true });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('chatForm').dispatchEvent(new Event('submit'));
        }
    });
});