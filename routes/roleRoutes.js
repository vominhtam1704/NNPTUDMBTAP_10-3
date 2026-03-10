const express = require('express');
const roleController = require('../controllers/roleController');

const router = express.Router();

// CREATE - POST /roles
router.post('/', roleController.createRole);

// READ - GET /roles
router.get('/', roleController.getAllRoles);

// READ - GET /roles/:id
router.get('/:id', roleController.getRoleById);

// UPDATE - PUT /roles/:id
router.put('/:id', roleController.updateRole);

// DELETE - DELETE /roles/:id
router.delete('/:id', roleController.deleteRole);

module.exports = router;
