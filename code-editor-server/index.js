// Remove dotenv, pg, and nanoid requires if they were there
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
// const path = require('path'); // Only needed if serving static files from here

const app = express();
const PORT = 3001; // Keep using port 3001 locally

// Allow connections from your React app (running on port 3000)
app.use(cors({ origin: "http://localhost:3000" }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store current code for each room *in memory* (will reset if server restarts)
const roomCode = {}; // Example: { 'roomId1': 'code snippet', 'roomId2': 'another code' }

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    // Send the current code in the room to the newly joined user
    if (roomCode[roomId]) {
      socket.emit('receive-code-change', roomCode[roomId]);
    } else {
        // Initialize room if it doesn't exist
        roomCode[roomId] = "// Start typing...";
        socket.emit('receive-code-change', roomCode[roomId]);
    }
  });

  socket.on('code-change', ({ roomId, newCode }) => {
    // Update the code for this room in memory
    roomCode[roomId] = newCode;
    // Broadcast this change only to users in the *same room*
    socket.to(roomId).emit('receive-code-change', newCode);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // Optional: Clean up empty rooms from memory if needed
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});