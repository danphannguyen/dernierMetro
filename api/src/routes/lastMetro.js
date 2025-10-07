const express = require("express");
const router = express.Router();
const pool = require("../utils/db");
const { toSlug } = require("../utils/searchStations");

router.get("/", async (req, res) => {
	const station = req.query.station;

	if (!station) {
		return res.status(400).json({
			message: "Station is required",
			error: "Station is required",
		});
	}

	try {
		// Récupère les configs
		const result = await pool.query(
			`SELECT key, value FROM public.config WHERE key IN ('metro.defaults', 'metro.last')`
		);

		const configMap = {};
		result.rows.forEach((row) => {
			configMap[row.key] =
				typeof row.value === "string" ? JSON.parse(row.value) : row.value;
		});

		const defaults = configMap["metro.defaults"];
		const stations = configMap["metro.last"];

			// Match the station by slug so the route accepts human-readable names or slugs
			const stationKey = Object.keys(stations).find((name) => {
				return toSlug(name) === toSlug(station);
			});

		if (!stationKey) {
			return res.status(404).json({
				message: "Station not found",
			});
		}

		return res.status(200).json({
			station: stationKey,
			lastMetro: stations[stationKey],
			line: defaults.line,
			tz: defaults.tz,
		});
	} catch (err) {
		console.error("DB error:", err.message);
		return res.status(500).json({
			message: "Internal server error",
			error: err.message,
		});
	}
});

module.exports = router;
