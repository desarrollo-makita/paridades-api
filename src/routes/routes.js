const express = require('express');
const router = express.Router();
const { paridades } = require('../controllers/paridadesControllers');

router.get('/', paridades);
router.get('/paridades', paridades);

module.exports = router;
