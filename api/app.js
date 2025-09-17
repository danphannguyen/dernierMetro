"use strict";

const express = require("express");

// Middlewares globaux
const logger = require("./src/middlewares/logger");
const notFound = require("./src/middlewares/notFound");
const cors = require("./src/middlewares/cors");

const app = express();

// Middlewares
app.use(logger);
app.use(cors);

// Routes
app.use("/health", require("./src/routes/health"));
app.use("/next-metro", require("./src/routes/nextMetro"));
app.use("/last-metro", require("./src/routes/lastMetro"));

// Middleware 404
app.use(notFound);

module.exports = app;
