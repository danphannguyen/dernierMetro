function nextArrival(now = new Date()) {
  const tz = "Europe/Paris";
  const toHM = d => String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');

  // Lire les variables d'environnement ou utiliser des valeurs par défaut
  const headwayMin = process.env.HEADWAY_MIN ? parseInt(process.env.HEADWAY_MIN, 10) : 3;
  const lastWindowStr = process.env.LAST_WINDOW_START || "00:45";
  const serviceEndStr = process.env.SERVICE_END || "01:15";

  const [lastHour, lastMin] = lastWindowStr.split(":").map(Number);
  const [endHour, endMin] = serviceEndStr.split(":").map(Number);

  const end = new Date(now);
  end.setHours(endHour, endMin, 0, 0);

  const lastWindow = new Date(now);
  lastWindow.setHours(lastHour, lastMin, 0, 0);

  // Vérifier si le service est fermé
  if (now > end) return { service: 'closed', tz };

  const next = new Date(now.getTime() + headwayMin * 60 * 1000);
  return {
    nextArrival: toHM(next),
    isLast: now >= lastWindow,
    headwayMin,
    tz
  };
}

module.exports = { nextArrival };
