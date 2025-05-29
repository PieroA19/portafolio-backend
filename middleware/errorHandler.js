// backend/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor',
  });
};

module.exports = errorHandler;
