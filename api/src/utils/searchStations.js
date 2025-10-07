const pool = require("../utils/db");

function toSlug(name) {
  if (!name || typeof name !== "string") return "";
  return name
    .normalize("NFD") // décompose les accents
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .toLowerCase()
    .replace(/[\s']+/g, "-"); // espace/apostrophe -> tiret
}

async function findStationExact(slug) {
  const query = `
    SELECT id, name, lines
    FROM public.stations
    WHERE slug = $1
    LIMIT 1;
  `;
  try {
    const result = await pool.query(query, [slug]);
    return result.rows[0] || null;
  } catch (err) {
    console.error("Erreur lors de la récupération de la station :", err);
    throw err;
  }
}


async function suggestStations(name) {
  const query = `
    SELECT name
    FROM public.stations
    WHERE LOWER(name) LIKE LOWER($1)
    ORDER BY name ASC;
  `;

  try {
    const result = await pool.query(query, [`%${name}%`]);
		console.log(name)
		console.log(result);
    return result.rows.map((r) => r.name);
  } catch (err) {
    console.error("Erreur lors de la suggestion de stations :", err);
    throw err;
  }
}

module.exports = { findStationExact, suggestStations, toSlug };
