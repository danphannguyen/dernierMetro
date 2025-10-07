const express = require("express");
const router = express.Router();
const { nextArrival } = require("../utils/metro");
const { findStationExact, suggestStations, toSlug } = require("../utils/searchStations");

router.get("/", async (req, res) => {
  const station = req.query.station;
  const n = Math.min(parseInt(req.query.n, 10) || 1, 5);

  if (!station) {
    return res.status(400).json({
      message: "Station is required",
      error: "Station is required",
    });
  }

  // accept human-readable station names; convert to slug for DB lookup
  const slug = toSlug(station);
  const stationObj = await findStationExact(slug);

  if (!stationObj) {
  const suggestions = await suggestStations(station);
    return res.status(404).json({
      message: "Station not found",
      suggestions,
    });
  }
  const arrival = nextArrival(undefined, n);

  if (arrival.service === "closed") {
    console.log(
      `[INFO] Requested next metro after service hours for station "${station}"`
    );
    return res.status(200).json({
      station: stationObj.name,
      arrivals: arrival.arrivals,
      ligne: stationObj.lines.join(","),
      message: "Service closed",
      tz: arrival.tz,
    });
  }

  return res.status(200).json({
    station: stationObj.name,
    ligne: stationObj.lines.join(","),
    arrivals: arrival.arrivals,
    tz: arrival.tz,
  });
});

module.exports = router;
