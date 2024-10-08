const router = require('express').Router();

router.use('/api/auth', require('./auth'));

module.exports = router;
