const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/contactController');
const { contactValidationRules, validate } = require('../validations/contactValidation');

// Aplica validaciones antes del controlador
router.post('/', contactValidationRules, validate, sendMessage);

// ✅ Ruta para obtener todos los mensajes (GET)
router.get('/', getMessages);

module.exports = router;
