require('dotenv').config();
const validator = require('validator');
const Mensaje = require('../models/Mensaje'); // Importa el modelo de Mongoose

const sendMessage = async (req, res, next) => {
  let { name, email, message } = req.body;

  console.log('📥 POST /api/contact recibido');

  // Sanitizar datos
  name = validator.trim(name || '');
  email = validator.normalizeEmail(email || '');
  message = validator.trim(message || '');

  console.log('📨 Datos recibidos:', { name, email, message });

  // Validaciones
  if (validator.isEmpty(name)) {
    console.warn('⚠️ Nombre vacío');
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

  if (!validator.isEmail(email)) {
    console.warn('⚠️ Email no válido');
    return res.status(400).json({ error: 'Correo electrónico no válido.' });
  }

  if (validator.isEmpty(message) || !validator.isLength(message, { min: 10 })) {
    console.warn('⚠️ Mensaje demasiado corto');
    return res.status(400).json({ error: 'El mensaje debe tener al menos 10 caracteres.' });
  }

  try {
    // Crear nuevo documento y guardar en MongoDB
    const nuevoMensaje = new Mensaje({ name, email, message });
    await nuevoMensaje.save();

    console.log('✅ Mensaje guardado en MongoDB');
    res.status(201).json({ message: 'Mensaje guardado exitosamente en la base de datos.' });
  } catch (err) {
    console.error('❌ Error al guardar el mensaje en MongoDB:', err.message);
    next(err);
  }
};

module.exports = { sendMessage };
