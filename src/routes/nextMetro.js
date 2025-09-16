const express = require("express");
const router = express.Router();
const { nextArrival } = require("../utils/metro");

router.get("/", (req, res) => {
  const station = req.query.station;

  if (!station) {
    return res.status(400).json({
      message: "Station is required",
      error: "Station is required",
    });
  }

  const arrival = nextArrival();

  if (arrival.service === "closed") {
    console.log(`[INFO] Requested next metro after service hours for station "${station}"`);
    return res.status(200).json({
      station,
      ligne: "M7",
      message: "Service closed",
      timeZone: arrival.tz
    });
  }

  return res.status(200).json({
    station,
    ligne: "M7",
    prochainPassage: arrival.nextArrival,
    isLast: arrival.isLast,
  });
});

module.exports = router;
