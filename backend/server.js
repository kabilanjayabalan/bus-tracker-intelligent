const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// Load Environment Variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Setup Express app
const app = express();

// Create HTTP server for both Express and Socket.io
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for the mobile app
    methods: ["GET", "POST"]
  }
});

// Pass the `io` instance to our socket handler
require("./socket/locationSocket")(io);

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser

// Mount Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bus", require("./routes/busRoutes"));
app.use("/api/routes", require("./routes/routeRoutes"));
// app.use("/api/ticket", require("./routes/ticketRoutes")); // Ticket logic pending

// Base Health Endpoint
app.get("/", (req, res) => {
  res.send("BusTrack Backend & Socket.io Running Successfully 🚀");
});

// Start the server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});