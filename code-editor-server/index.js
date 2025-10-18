const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
// Use Render's port or 3001
const PORT = process.env.PORT || 3001; 

// --- THIS IS THE CHANGE ---
// We will get this URL from Render after we deploy the frontend
const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({ origin: frontendURL }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: frontendURL,
    methods: ["GET", "POST"]
  }
});

// ... (The rest of your io.on('connection', ...) code remains exactly the same) ...
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('code-change', ({ roomId, newCode }) => {
    socket.to(roomId).emit('receive-code-change', newCode);
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});