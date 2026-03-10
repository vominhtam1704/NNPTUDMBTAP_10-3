const Role = require('../models/Role');

// CREATE - Tạo role mới
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Tên role là bắt buộc',
      });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: 'Role này đã tồn tại',
      });
    }

    const role = new Role({
      name,
      description: description || '',
    });

    await role.save();

    res.status(201).json({
      success: true,
      message: 'Tạo role thành công',
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// READ - Lấy tất cả roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách roles thành công',
      data: roles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// READ - Lấy role theo ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role không tồn tại',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lấy role thành công',
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE - Cập nhật role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role không tồn tại',
      });
    }

    // Kiểm tra xem name có trùng với role khác không
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(409).json({
          success: false,
          message: 'Tên role này đã tồn tại',
        });
      }
    }

    role.name = name || role.name;
    role.description = description !== undefined ? description : role.description;

    await role.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật role thành công',
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE - Xoá role (xoá mềm không được dùng cho Role, xoá cứng)
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role không tồn tại',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xoá role thành công',
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
