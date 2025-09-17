function nextArrival(now = new DateTime.now().setZone("Europe/Paris"), n = 1) {
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

  // si end est avant ou égal à lastWindow, on considère que ça passe au lendemain
  if (end <= lastWindow) {
		end.setDate(end.getDate() + 1);
	}

	// Vérifier si le service est fermé
	if (now > end) return { service: "closed", tz };

	// Générer les n prochains horaires
	const arrivals = [];

	for (let i = 1; i <= n; i++) {
		const nextTime = new Date(now.getTime() + headwayMin * i * 60 * 1000);
		if (nextTime > end) break;

		arrivals.push({
			time: toHM(nextTime),
			isLast: new Date(now.getTime() + headwayMin * (i+1) * 60 * 1000) >= end,
		});
	}

	return { arrivals, tz };
}

module.exports = { nextArrival };
