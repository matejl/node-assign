/**
 * Created by matej on 20/10/2018.
 */
const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login');

router.post('/', loginController.index);

module.exports = router;