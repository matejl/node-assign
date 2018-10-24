/**
 * Created by matej on 20/10/2018.
 */
const express = require('express');
const router = express.Router();

const meController = require('../controllers/me');

router.get('/', meController.index);
router.post('/update-password', meController.updatePassword);

module.exports = router;