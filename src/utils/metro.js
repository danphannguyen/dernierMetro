function nextArrival(now = new Date(), n = 1) {
	const tz = "Europe/Paris";
	const toHM = (d) =>
		String(d.getHours()).padStart(2, "0") +
		":" +
		String(d.getMinutes()).padStart(2, "0");

	const headwayMin = process.env.HEADWAY_MIN
		? parseInt(process.env.HEADWAY_MIN, 10)
		: 3;
	const lastWindowStr = process.env.LAST_WINDOW_START || "00:45";
	const serviceEndStr = process.env.SERVICE_END || "01:15";

	const [lastHour, lastMin] = lastWindowStr.split(":").map(Number);
	const [endHour, endMin] = serviceEndStr.split(":").map(Number);

	const end = new Date(now);
	end.setHours(endHour, endMin, 0, 0);

	const lastWindow = new Date(now);
	lastWindow.setHours(lastHour, lastMin, 0, 0);

	// Vérifier si le service est fermé
	if (now > end) return { service: "closed", tz };

	// Générer les n prochains horaires
	const prochainPassages = [];
	let isLast = false;

	for (let i = 1; i <= n; i++) {
		const nextTime = new Date(now.getTime() + headwayMin * i * 60 * 1000);
		if (nextTime > end) break;

		if (nextTime >= lastWindow) {
			isLast = true;
		}

		prochainPassages.push(toHM(nextTime));
	}

	return { prochainPassages, isLast, tz };
}

module.exports = { nextArrival };
