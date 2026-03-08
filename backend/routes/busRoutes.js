const express = require("express");
const router = express.Router();

const {
  createBus,
  getAllBuses,
  searchBus,
  updateLocation,
  getBusById
} = require("../controllers/busController");

router.post("/", createBus);
router.get("/", getAllBuses);
router.get("/search", searchBus);
router.put("/location", updateLocation);
router.get("/:id", getBusById);

module.exports = router;