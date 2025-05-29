// backend/controllers/contactController.js

require('dotenv').config();
const validator = require('validator');
const Message = require('../models/Message'); // Asegúrate de que el nombre del modelo coincida con el archivo
const sendNotificationEmail = require('../utils/mailer'); // 👈 Importa la función del mailer

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
    // Crear y guardar en MongoDB usando el modelo Message
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    // Enviar correo de notificación
    await sendNotificationEmail({ name, email, message });
    
    console.log('✅ Mensaje guardado en MongoDB');
    res.status(201).json({ message: 'Mensaje guardado exitosamente en la base de datos.' });
  } catch (err) {
    console.error('❌ Error al guardar el mensaje en MongoDB:', err.message);
    next(err);
  }
};

// Obtener todos los mensajes
const getMessages = async (req, res, next) => {
  try {
    const mensajes = await Message.find().sort({ date: -1 }); // ordenados por fecha descendente
    res.status(200).json(mensajes);
  } catch (err) {
    console.error('❌ Error al obtener los mensajes:', err.message);
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
};

// Exportar ambas funciones
module.exports = {
  sendMessage,
  getMessages
};
