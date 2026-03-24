const Bus = require("../models/Bus");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Join a specific bus tracking room
    socket.on("joinBusRoom", (busId) => {
      socket.join(busId);
      console.log(`📌 Socket ${socket.id} joined room for Bus: ${busId}`);
    });

    // Leave bus room
    socket.on("leaveBusRoom", (busId) => {
      socket.leave(busId);
      console.log(`🛑 Socket ${socket.id} left room for Bus: ${busId}`);
    });

    // Conductor emitting location updates
    // { busId, lat, lng }
    socket.on("updateLocation", async (data) => {
      try {
        const { busId, lat, lng } = data;
        
        // 1. Save to database for persistence
        const bus = await Bus.findById(busId);
        if (bus) {
          bus.currentLocation = { lat, lng };
          await bus.save();
          
          // 2. Broadcast to all clients in this specific bus room
          io.to(busId).emit("locationUpdated", {
            busId,
            currentLocation: { lat, lng },
            timestamp: new Date()
          });
          
          // 3. Optional: broadcast globally for a dashboard map that watches everything
          io.emit("globalLocationUpdate", {
            busId,
            currentLocation: { lat, lng }
          });
        }
      } catch (error) {
        console.error("Socket Update Error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};
