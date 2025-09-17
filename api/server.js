"use strict";

// === Import ===
const express = require("express");

// Middlewares globaux
const logger = require("./src/middlewares/logger");
const notFound = require("./src/middlewares/notFound");
const cors = require("./src/middlewares/cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Need to be before all routes
app.use(logger);
app.use(cors);

// === Routes ===
app.use("/health", require("./src/routes/health"));
app.use("/next-metro", require("./src/routes/nextMetro"));

// Need to be after all routes (default case)
app.use(notFound)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});