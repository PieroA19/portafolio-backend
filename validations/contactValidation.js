const { check, validationResult } = require('express-validator');

const contactValidationRules = [
  check('name')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio.')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),

  check('email')
    .normalizeEmail()
    .isEmail().withMessage('Debe proporcionar un correo electrónico válido.'),

  check('message')
    .trim()
    .notEmpty().withMessage('El mensaje no puede estar vacío.')
    .isLength({ min: 10 }).withMessage('El mensaje debe tener al menos 10 caracteres.'),
];

// Middleware para revisar errores de validación
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Devuelve el primer error encontrado
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

module.exports = {
  contactValidationRules,
  validate,
};
