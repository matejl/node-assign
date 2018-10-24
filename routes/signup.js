/**
 * Created by matej on 20/10/2018.
 */
const express = require('express');
const router = express.Router();

const signupController = require('../controllers/signup');

router.post('/', signupController.index);

module.exports = router;