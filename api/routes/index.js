const express = require('express');
const router = express.Router();
const home = require('./api/modules/home');

router.use('/', home)

module.exports = router;
