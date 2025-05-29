// backend/routes/adminRoutes.js

const express = require('express');
const path = require('path');
const basicAuth = require('../middleware/basicAuth');

const router = express.Router();

router.get('/admin', basicAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin.html'));
});

module.exports = router;
