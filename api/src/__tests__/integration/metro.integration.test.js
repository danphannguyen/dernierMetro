// api/src/__tests__/integration/metro.integration.test.js
const request = require("supertest");
const app = require("../../../app");
const pool = require("../../utils/db");

describe("Integration tests - Metro API", () => {
  const RealDate = Date;

  // Seed minimal pour tests indépendants
  beforeAll(async () => {
    await pool.query(`
      INSERT INTO public.config (key, value)
      VALUES 
        ('metro.defaults', '{"line":"1","tz":"Europe/Paris"}')
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    `);

    await pool.query(`
      INSERT INTO public.config (key, value)
      VALUES 
        ('metro.last', '{"Châtelet":"23:45","Art et Métiers":"23:50"}')
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    `);

    global.Date = class extends RealDate {
			constructor(...args) {
				if (args.length === 0) {
					return new RealDate("2025-09-17T12:00:00Z");
				}
				return new RealDate(...args);
			}
			static now() {
				return new RealDate("2025-09-17T12:00:00Z").getTime();
			}
		};

    // Modifie les variables d'environnements
    process.env.LAST_WINDOW_START = "12:00";
    process.env.SERVICE_END = "15:00";
  });

  afterAll(async () => {
    await pool.end(); // ferme la connexion DB après les tests
    global.Date = RealDate;
    // Reset les variables d'environnements
    delete process.env.LAST_WINDOW_START;
    delete process.env.SERVICE_END;
  });

  // ===== /last-metro =====
  describe("/last-metro", () => {
    test("200 avec station connue (peu importe la casse)", async () => {
      const res = await request(app).get("/last-metro?station=châtelet");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("station", "Châtelet");
      expect(res.body).toHaveProperty("lastMetro", "23:45");
      expect(res.body).toHaveProperty("line", "1");
      expect(res.body).toHaveProperty("tz", "Europe/Paris");
    });

    test("404 avec station inconnue", async () => {
      const res = await request(app).get("/last-metro?station=UnknownStation");
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Station not found");
    });

    test("400 sans station", async () => {
      const res = await request(app).get("/last-metro");
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Station is required");
    });
  });

  // ===== /next-metro =====
  describe("/next-metro", () => {
    test("200 avec station connue et nextArrival au format HH:MM", async () => {
      const res = await request(app).get(
        "/next-metro?station=Arts%20et%20M%C3%A9tiers&n=2"
      );
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("arrivals");
      expect(Array.isArray(res.body.arrivals)).toBe(true);
      expect(res.body.arrivals.length).toBeGreaterThan(0);
      res.body.arrivals.forEach((a) => {
        expect(a.time).toMatch(/^\d{2}:\d{2}$/); // format HH:MM
      });
      expect(res.body).toHaveProperty("tz", "Europe/Paris");
    });

    test("404 avec station inconnue", async () => {
      const res = await request(app).get("/next-metro?station=Unknown&n=2");
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Station not found");
    });

    test("400 sans station", async () => {
      const res = await request(app).get("/next-metro");
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Station is required");
    });
  });
});
