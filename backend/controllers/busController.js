const Bus = require("../models/Bus");
const Route = require("../models/Route");

/*
---------------------------------------------------
1️⃣ Create Bus (Auto fetch routeId using routeName)
---------------------------------------------------
*/
exports.createBus = async (req, res) => {
  try {
    const { busNumber, routeName, speed, lat, lng } = req.body;

    const route = await Route.findOne({ routeName });

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const bus = new Bus({
      busNumber,
      routeId: route._id,
      speed,
      currentLocation: {
        lat,
        lng
      }
    });

    await bus.save();

    res.status(201).json({
      message: "Bus created successfully",
      bus
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
---------------------------------------------------
2️⃣ Get All Buses
---------------------------------------------------
*/
exports.getAllBuses = async (req, res) => {
  try {

    const buses = await Bus.find().populate("routeId");

    res.json(buses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
---------------------------------------------------
3️⃣ Search Bus (Source → Destination)
---------------------------------------------------
*/
exports.searchBus = async (req, res) => {
  try {

    const { source, destination } = req.query;

    if (!source || !destination) {
      return res.status(400).json({
        message: "Source and Destination are required"
      });
    }

    // Find routes containing both stops
    const routes = await Route.find({
      "stops.name": { $all: [source, destination] }
    });

    let result = [];

    for (let route of routes) {

      const sourceStop = route.stops.find(s => s.name === source);
      const destStop = route.stops.find(s => s.name === destination);

      if (!sourceStop || !destStop) continue;

      // Ensure correct travel direction
      if (sourceStop.order >= destStop.order) continue;

      // Find buses on that route
      const buses = await Bus.find({ routeId: route._id });

      buses.forEach(bus => {

        // Temporary distance simulation
        const distance = Math.random() * 5;

        // ETA calculation
        const eta = Math.round((distance / bus.speed) * 60);

        result.push({
          busNumber: bus.busNumber,
          routeName: route.routeName,
          eta: `${eta} minutes`
        });

      });
    }

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
---------------------------------------------------
4️⃣ Update Bus Location (for conductor app)
---------------------------------------------------
*/
exports.updateLocation = async (req, res) => {
  try {

    const { busId, lat, lng } = req.body;

    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    bus.currentLocation = { lat, lng };

    await bus.save();

    res.json({
      message: "Bus location updated",
      bus
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
---------------------------------------------------
5️⃣ Get Bus By ID
---------------------------------------------------
*/
exports.getBusById = async (req, res) => {
  try {

    const bus = await Bus.findById(req.params.id).populate("routeId");

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json(bus);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};