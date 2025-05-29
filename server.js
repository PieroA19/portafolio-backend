// backend/server.js

require('dotenv').config();

// Importaciones
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Configuraciones
const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB 
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conexión a MongoDB Atlas establecida'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌱 Entorno: ${process.env.NODE_ENV}`);
});
