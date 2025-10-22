const express = require('express');
const http = require('http'); // <-- Import the 'http' module
const { Server } = require("socket.io"); // <-- Import the 'Server' class
const path = require('path'); // Import the 'path' module
const { nanoid } = require('nanoid'); // Assuming you use nanoid
const { Pool } = require('pg'); // Assuming you use pg

// Debugging line (optional, but helpful)
console.log("Checking DATABASE_URL value:", process.env.DATABASE_URL);

// --- Database Setup ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

const createTable = async () => {
  try {
    const queryText = `
      CREATE TABLE IF NOT EXISTS urls (
        short_code TEXT PRIMARY KEY,
        long_url TEXT NOT NULL
      );
    `;
    await pool.query(queryText);
    console.log("Table 'urls' is ready.");
  } catch (err) {
    console.error("Error creating table", err);
  }
};

createTable();

// --- Server Setup ---
const app = express();
const PORT = process.env.PORT || 3001; // Use Render's port or 3001
app.use(express.json());

// --- CORRECTED STATIC FILE SERVING ---
// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, '../code-editor-client/build')));

// --- API Endpoints ---
app.post('/api/shorten', async (req, res) => {
  // ... (Your shorten endpoint code) ...
  // Make sure the URL uses your actual deployed domain
  const deployedUrl = `https://your-app-name.onrender.com`; // <-- Replace with your Render URL
  // ... (rest of shorten code) ...
});

// --- CORRECTED FALLBACK ROUTE ---
// Handles any requests that don't match the API routes
// Sends the React app's index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../code-editor-client/build', 'index.html'));
});

// --- Socket.IO Setup ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now, restrict later if needed
    methods: ["GET", "POST"]
  }
});

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

// Start the server (using 'server' for socket.io)
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});