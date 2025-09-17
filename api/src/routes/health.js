const express = require("express");
const router = express.Router();
const pool = require("../utils/db");

// === Health de l'API ===
router.get("/api", (req, res) => {
  res.status(200).json({
    message: "Hello Everyone",
    status: "success"
  });
});

// === Health de la BDD ===
router.get("/db", async (req, res) => {
  try {
    await pool.query("SELECT 1"); // simple ping
    res.status(200).json({
      status: "ok",
      message: "Database is connected",
    });
  } catch (err) {
    console.error("DB health check error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: err.message,
    });
  }
});

module.exports = router;