"use strict";

// === Import ===
const express = require("express");

// Middlewares globaux
const logger = require("./src/middlewares/logger");
const notFound = require("./src/middlewares/notFound");

const app = express();
const PORT = process.env.PORT || 3000;

// Need to be before all routes
app.use(logger)

// === Routes ===
app.use("/health", require("./src/routes/health"));
app.use("/next-metro", require("./src/routes/nextMetro"));

// Need to be after all routes (default case)
app.use(notFound)

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})