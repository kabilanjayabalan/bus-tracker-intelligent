const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busNumber: String,
  routeName: String,

  totalSeats: Number,
  availableSeats: Number,

  currentLocation: {
    latitude: Number,
    longitude: Number
  },

  estimatedArrivalTime: String,
  nextStop: String,
  departureTime: String,

  status: {
    type: String,
    enum: ["Running", "Stopped", "Delayed"],
    default: "Running"
  },

  stops: [
    {
      name: String,
      order: Number
    }
  ],

  routeCoordinates: [
    {
      latitude: Number,
      longitude: Number
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Bus", busSchema);