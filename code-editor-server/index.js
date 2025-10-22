const path = require('path'); // Import the 'path' module

// --- Server Setup ---
const app = express();
// Use Fly.io's default internal port 8080, or 3001 locally
const PORT = process.env.PORT || 8080; // Use Railway's port or 3001
app.use(express.json());

// --- UPDATED STATIC FILE SERVING ---
// Serve static files from the React build directory
// Serve static files from the 'public' folder (where Docker copies the build)
app.use(express.static(path.join(__dirname, 'public')));

// Ensure the fallback route also points to the 'public' folder
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Socket.IO Setup (Keep this section) ---
const server = http.createServer(app);
// ... rest of your socket.io configuration ...
// Make sure CORS origin points to your future Railway URL or '*' for testing
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now, refine later
    methods: ["GET", "POST"]
  }
});
// ... rest of your io.on('connection', ...) code ...

// Start the server (using 'server' for socket.io)
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});