require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const chatRoutes = require('./routes/chat');
const locationRoutes = require('./routes/locations');
const taxiRoutes = require('./routes/taxis');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zintasa-tour', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/taxis', taxiRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });
}

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Join room based on user ID
    socket.on('joinRoom', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });
    
    // Handle chat messages
    socket.on('chatMessage', async (data) => {
        try {
            const { sender, recipient, message } = data;
            
            // Save message to database
            const newMessage = new Chat({
                sender,
                recipient,
                message
            });
            
            await newMessage.save();
            
            // Emit to recipient
            io.to(recipient).emit('chatMessage', newMessage);
            
            // Also send back to sender for their UI
            io.to(sender).emit('chatMessage', newMessage);
        } catch (err) {
            console.error('Error handling chat message:', err);
        }
    });
    
    // Handle location sharing
    socket.on('shareLocation', (data) => {
        const { recipient, location } = data;
        io.to(recipient).emit('locationShared', {
            sender: socket.userId,
            location
        });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});