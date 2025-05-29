require('dotenv').config();

const fs = require('fs');
const path = require('path');
const validator = require('validator');

// Ruta al archivo de mensajes, configurable a través de una variable de entorno
const messagesFile = process.env.MESSAGES_FILE
  ? path.join(__dirname, '..', process.env.MESSAGES_FILE)
  : path.join(__dirname, '..', 'messages', 'messages.json');


// Función para validar email con regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sendMessage = (req, res, next) => {
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

  const newMessage = {
    name,
    email,
    message,
    date: new Date().toISOString()
  };

  // Leer, agregar y guardar mensaje
  fs.readFile(messagesFile, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error al leer el archivo:', err.message);
      return next(err);
    }

    let messages = [];
    try {
      messages = JSON.parse(data);
    } catch (e) {
      console.error('❌ Error al parsear el archivo JSON:', e.message);
      return next(e);
    }

    messages.push(newMessage);

    fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), err => {
      if (err) {
        console.error('❌ Error al guardar el mensaje:', err.message);
        return next(err);
      }

      console.log('✅ Mensaje guardado exitosamente');
      res.status(201).json({ message: 'Mensaje guardado exitosamente' });
    });
  });
};

module.exports = { sendMessage };