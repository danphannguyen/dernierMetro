const { nextArrival } = require("../../utils/metro");

describe("nextArrival util function", () => {
	const RealDate = Date;

	// Mock Date pour toujours retourner 2025-09-17 12:00:00
	beforeAll(() => {
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

	afterAll(() => {
		global.Date = RealDate;
    // Reset les variables d'environnements
    delete process.env.LAST_WINDOW_START;
    delete process.env.SERVICE_END;
	});

	test("headway = 3 returns +3 min correctly", () => {
		process.env.HEADWAY_MIN = "3";
		const result = nextArrival(new Date(), 1);
		expect(result.arrivals.length).toBe(1);

		const [hours, minutes] = result.arrivals[0].time.split(":").map(Number);
		expect(hours).toBe(14); // UTC+2
		expect(minutes).toBe(3);
		expect(result.arrivals[0].isLast).toBe(false);
	});

	test("default headway (no HEADWAY_MIN) returns +3 min", () => {
		delete process.env.HEADWAY_MIN;
		const result = nextArrival(new Date(), 1);
		expect(result.arrivals.length).toBe(1);

		const [hours, minutes] = result.arrivals[0].time.split(":").map(Number);
		expect(hours).toBe(14);
		expect(minutes).toBe(3);
	});

	test("invalid headway (<=0) returns empty arrivals", () => {
		process.env.HEADWAY_MIN = "0";
		const result = nextArrival(new Date(), 1);
		expect(result.arrivals.length).toBe(0);
	});
});
