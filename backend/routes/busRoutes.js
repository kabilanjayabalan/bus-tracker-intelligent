const express = require("express");
const router = express.Router();

const {
  createBus,
  getAllBuses,
  searchBus,
  getBusById,
  updateLocation
} = require("../controllers/busController");

router.post("/", createBus);
router.get("/", getAllBuses);
router.get("/search", searchBus);
router.get("/:id", getBusById);
router.put("/location", updateLocation);

module.exports = router;