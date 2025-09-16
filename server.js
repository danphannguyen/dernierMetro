"use strict";

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Need to be before all routes
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on("finish", () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`)
  })

  // Permet de ne pas bloquer la requête
  next();
})

app.get("/health", (req, res) => {
  return res.status(200).json({
    message: "Hello Everyone",
    status: "success"
  })
})

app.get("/next-metro", (req, res) => {
  const station = req.query.station;

  let status = 500;
  let response = {
    message: "Unhandled option",
    error: "Internal Server Error",
  };

  if (!station) {
    status = 400;
    response = {
      message: "Station is required",
      error: "Station is required",
    };
  } else {
    status = 200;
    response = {
      station,
      ligne: "M7",
      prochainPassage: "00:10",
    };
  }

  res.status(status).json(response);
});

// Need to be after all routes (default case)
app.use((req, res, next) => {
  return res.status(404).json({
    message: "Route not found",
    status: "URL not found"
  })
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})