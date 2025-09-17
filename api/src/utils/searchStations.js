const stations = require("../data/paris_metro_stations.json");

// Renvoie l'objet exact si trouvé, sinon null
function findStationExact(name) {
	return (
		stations.find((s) => s.station.toLowerCase() === name.toLowerCase()) || null
	);
}

// Renvoie un tableau de suggestions pour les recherches partielles
function suggestStations(name) {
	const query = name.toLowerCase();
	return stations
		.filter((s) => s.station.toLowerCase().includes(query))
		.map((s) => s.station);
}

module.exports = { findStationExact, suggestStations };
