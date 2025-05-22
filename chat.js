document.addEventListener('DOMContentLoaded', function() {
    const conversationList = document.getElementById('conversation-list');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const chatPartnerName = document.getElementById('chat-partner-name');
    
    // Sample data - in a real app, this would come from an API
    const conversations = [
        {
            id: 1,
            name: 'John Taxi Driver',
            lastMessage: 'I will be there in 10 minutes',
            time: '10:30 AM',
            unread: 0
        },
        {
            id: 2,
            name: 'Sunbird Hotel Reception',
            lastMessage: 'Your booking is confirmed',
            time: 'Yesterday',
            unread: 2
        }
    ];
    
    const messages = {
        1: [
            { sender: 'them', message: 'Hello, where are you located?', time: '10:20 AM' },
            { sender: 'me', message: 'I\'m at the Lilongwe City Mall', time: '10:25 AM' },
            { sender: 'them', message: 'I will be there in 10 minutes', time: '10:30 AM' }
        ],
        2: [
            { sender: 'them', message: 'Thank you for your booking', time: 'Yesterday' },
            { sender: 'them', message: 'Your booking is confirmed', time: 'Yesterday' }
        ]
    };
    
    let currentConversation = null;
    
    // Load conversations
    function loadConversations() {
        conversationList.innerHTML = '';
        
        conversations.forEach(convo => {
            const item = document.createElement('div');
            item.className = 'conversation-item';
            item.dataset.id = convo.id;
            item.innerHTML = `
                <h4>${convo.name}</h4>
                <p>${convo.lastMessage}</p>
                <div class="conversation-meta">
                    <span>${convo.time}</span>
                    ${convo.unread > 0 ? `<span class="unread">${convo.unread}</span>` : ''}
                </div>
            `;
            conversationList.appendChild(item);
            
            item.addEventListener('click', () => {
                currentConversation = convo.id;
                loadMessages(convo.id);
                chatPartnerName.textContent = convo.name;
                document.querySelectorAll('.conversation-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                messageInput.disabled = false;
                sendBtn.disabled = false;
            });
        });
    }
    
    // Load messages for a conversation
    function loadMessages(conversationId) {
        chatMessages.innerHTML = '';
        
        if (!messages[conversationId]) return;
        
        messages[conversationId].forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender === 'me' ? 'sent' : 'received'}`;
            messageDiv.innerHTML = `
                ${msg.message}
                <div class="message-time">${msg.time}</div>
            `;
            chatMessages.appendChild(messageDiv);
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Send message
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message || !currentConversation) return;
        
        // In a real app, this would send to the server via WebSocket
        const newMessage = {
            sender: 'me',
            message: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        if (!messages[currentConversation]) {
            messages[currentConversation] = [];
        }
        
        messages[currentConversation].push(newMessage);
        loadMessages(currentConversation);
        messageInput.value = '';
        
        // Mock reply after 1 second
        setTimeout(() => {
            const reply = {
                sender: 'them',
                message: 'Thanks for your message!',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            messages[currentConversation].push(reply);
            loadMessages(currentConversation);
        }, 1000);
    }
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Initial load
    loadConversations();
});