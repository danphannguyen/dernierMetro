module.exports = (req, res, next) => {
  return res.status(404).json({
    message: "Route not found",
    status: "URL not found"
  })
}