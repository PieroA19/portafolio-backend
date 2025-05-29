const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/contactController');
const { contactValidationRules, validate } = require('../validations/contactValidation');

// Aplica validaciones antes del controlador
router.post('/', contactValidationRules, validate, sendMessage);

module.exports = router;
