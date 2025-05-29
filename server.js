// backend/server.js

require('dotenv').config();

// Importaciones
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'); // 👈 FALTA ESTO

// Configuraciones
const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  // Estas opciones ya no son necesarias en mongoose v7+, pero puedes incluirlas para versiones antiguas
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conexión a MongoDB Atlas establecida'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Eventos de conexión (para Render, paso 4)
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB conectado desde Render');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión desde Render:', err);
});

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/contact', contactRoutes);
app.use('/', adminRoutes); // Ruta protegida para /admin

// Middleware de errores (debe ir al final)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// backend/server.js (al final)

const adminRoutes = require('./routes/adminRoutes');
app.use('/', adminRoutes); // Ruta protegida para /admin

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌱 Entorno: ${process.env.NODE_ENV}`);
});
