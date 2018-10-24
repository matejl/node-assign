/**
 * Created by matej on 20/10/2018.
 */
const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/:id', userController.get);
router.post('/:id/like', userController.like);
router.post('/:id/unlike', userController.unlike);

module.exports = router;