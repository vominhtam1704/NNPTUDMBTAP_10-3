const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// CREATE - POST /users
router.post('/', userController.createUser);

// POST - /users/enable (bật user) - PHẢI ĐẶT TRƯỚC :id
router.post('/enable', userController.enableUser);

// POST - /users/disable (tắt user) - PHẢI ĐẶT TRƯỚC :id
router.post('/disable', userController.disableUser);

// READ - GET /users (có query ?username=<username>)
router.get('/', userController.getAllUsers);

// READ - GET /users/:id
router.get('/:id', userController.getUserById);

// UPDATE - PUT /users/:id
router.put('/:id', userController.updateUser);

// DELETE - DELETE /users/:id (xoá mềm)
router.delete('/:id', userController.deleteUser);

module.exports = router;
