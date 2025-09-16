module.exports = (req, res, next) => {
  const startTime = Date.now();
  
  res.on("finish", () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`)
  })

  // Permet de ne pas bloquer la requête
  next();
}