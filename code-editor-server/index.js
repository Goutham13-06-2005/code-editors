const path = require('path'); // Import the 'path' module

// --- Server Setup ---
const app = express();
const PORT = process.env.PORT || 3001; // Use Railway's port or 3001
app.use(express.json());

// --- UPDATED STATIC FILE SERVING ---
// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../code-editor-client/build')));

// --- API Endpoints (Keep these as they were) ---
// app.post('/api/shorten', ...);
// app.get('/:shortCode', ...);

// --- ADD THIS FALLBACK ROUTE ---
// Handles any requests that don't match the API routes
// Sends the React app's index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../code-editor-client/build', 'index.html'));
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