const Bus = require("../models/Bus");

/*
---------------------------------------------------
1️⃣ Create Bus
---------------------------------------------------
*/
exports.createBus = async (req, res) => {
  try {

    const bus = new Bus({
      busNumber: req.body.busNumber,
      routeName: req.body.routeName,

      totalSeats: req.body.totalSeats,
      availableSeats: req.body.availableSeats,

      currentLocation: req.body.currentLocation,

      estimatedArrivalTime: req.body.estimatedArrivalTime,
      nextStop: req.body.nextStop,
      departureTime: req.body.departureTime,
      status: req.body.status,

      stops: req.body.stops,
      routeCoordinates: req.body.routeCoordinates
    });

    await bus.save();

    res.status(201).json({
      message: "Bus created successfully",
      data: bus
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
---------------------------------------------------
2️⃣ Get All Buses (for list screen)
---------------------------------------------------
*/
exports.getAllBuses = async (req, res) => {
  try {

    const buses = await Bus.find();

    const formatted = buses.map((bus) => ({
      id: bus._id.toString(),

      busNumber: bus.busNumber,
      routeName: bus.routeName,

      departureTime: bus.departureTime,
      eta: bus.estimatedArrivalTime,

      availableSeats: bus.availableSeats,
      totalSeats: bus.totalSeats,

      nextStop: bus.nextStop,
      status: bus.status
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
---------------------------------------------------
3️⃣ Search Bus (FROM → TO)
---------------------------------------------------
*/
exports.searchBus = async (req, res) => {
  try {

    const { source, destination } = req.query;

    if (!source || !destination) {
      return res.status(400).json({
        message: "Source and Destination required"
      });
    }

    const buses = await Bus.find({
      routeName: { $regex: source, $options: "i" }
    });

    // Filter buses that match destination also
    const result = buses
      .filter(bus =>
        bus.routeName.toLowerCase().includes(destination.toLowerCase())
      )
      .map(bus => ({
        id: bus._id.toString(),

        busNumber: bus.busNumber,
        routeName: bus.routeName,

        departureTime: bus.departureTime,
        eta: bus.estimatedArrivalTime,

        availableSeats: bus.availableSeats,
        totalSeats: bus.totalSeats,

        nextStop: bus.nextStop,
        status: bus.status
      }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
---------------------------------------------------
4️⃣ Get Bus By ID (Detail Screen)
---------------------------------------------------
*/
exports.getBusById = async (req, res) => {
  try {

    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found"
      });
    }

    res.json({
      id: bus._id.toString(),

      busNumber: bus.busNumber,
      routeName: bus.routeName,

      availableSeats: bus.availableSeats,
      totalSeats: bus.totalSeats,

      eta: bus.estimatedArrivalTime,
      nextStop: bus.nextStop,
      departureTime: bus.departureTime,

      status: bus.status,

      stops: bus.stops,
      routeCoordinates: bus.routeCoordinates,
      currentLocation: bus.currentLocation
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
---------------------------------------------------
5️⃣ Update Bus Location (for future live tracking)
---------------------------------------------------
*/
exports.updateLocation = async (req, res) => {
  try {

    const { busId, latitude, longitude } = req.body;

    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found"
      });
    }

    bus.currentLocation = {
      latitude,
      longitude
    };

    await bus.save();

    res.json({
      message: "Location updated",
      data: bus
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};