// backend/server.js

require('dotenv').config();

// Importaciones
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Configuraciones
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Permitir solicitudes desde otros orígenes
app.use(express.json()); // Parsear JSON del body

// Rutas
const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

// Producción: servir frontend (si lo integras más adelante)
//if (process.env.NODE_ENV === 'production') {
//  app.use(express.static(path.join(__dirname, '../src'))); // Ajusta si usas otro nombre de carpeta

//  app.get('*', (req, res) => {
//    res.sendFile(path.resolve(__dirname, '../src', 'index.html'));
//  });
//}

// 👉 Middleware para manejar errores (debe ir después de todas las rutas)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌱 Entorno: ${process.env.NODE_ENV}`);
});
