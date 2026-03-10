const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// GET - /roles/:roleId/users
router.get('/:roleId/users', userController.getUsersByRole);

module.exports = router;
