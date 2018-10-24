/**
 * Created by matej on 20/10/2018.
 */
const express = require('express');
const router = express.Router();

const mostLikedController = require('../controllers/most-liked');

router.get('/', mostLikedController.index);

module.exports = router;