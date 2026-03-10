const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');

// CREATE - Tạo user mới
exports.createUser = async (req, res) => {
  try {
    const { username, password, email, fullName, avatarUrl, role } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, email là bắt buộc',
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
      isDeleted: false,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username hoặc email đã tồn tại',
      });
    }

    // Mã hoá password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      fullName: fullName || '',
      avatarUrl: avatarUrl || 'https://i.sstatic.net/l60Hf.png',
      role: role || null,
    });

    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      message: 'Tạo user thành công',
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// READ - Lấy tất cả users (chưa bị xoá mềm)
// Query: /users?username=<username> để filter theo username (includes)
exports.getAllUsers = async (req, res) => {
  try {
    const { username } = req.query;

    let filter = { isDeleted: false };

    if (username) {
      filter.username = { $regex: username, $options: 'i' }; // i = case insensitive
    }

    const users = await User.find(filter)
      .populate('role', 'name description')
      .select('-password');

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách users thành công',
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// READ - Lấy user theo ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id, isDeleted: false })
      .populate('role', 'name description')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lấy user thành công',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE - Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, fullName, avatarUrl, role, loginCount } = req.body;

    const user = await User.findOne({ _id: id, isDeleted: false });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại',
      });
    }

    // Kiểm tra username trùng
    if (username && username !== user.username) {
      const existingUser = await User.findOne({
        username,
        isDeleted: false,
        _id: { $ne: id },
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Username đã tồn tại',
        });
      }
    }

    // Kiểm tra email trùng
    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        email,
        isDeleted: false,
        _id: { $ne: id },
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email đã tồn tại',
        });
      }
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.fullName = fullName !== undefined ? fullName : user.fullName;
    user.avatarUrl = avatarUrl || user.avatarUrl;
    user.role = role !== undefined ? role : user.role;
    user.loginCount = loginCount !== undefined ? Math.max(loginCount, 0) : user.loginCount;

    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({
      success: true,
      message: 'Cập nhật user thành công',
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE - Xoá user (xoá mềm - chỉ set isDeleted = true)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id, isDeleted: false });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại',
      });
    }

    user.isDeleted = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Xoá user thành công',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ENABLE - Bật user thông qua email và username
exports.enableUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email và username là bắt buộc',
      });
    }

    const user = await User.findOne({
      email,
      username,
      isDeleted: false,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại hoặc thông tin không đúng',
      });
    }

    user.status = true;
    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({
      success: true,
      message: 'Kích hoạt user thành công',
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DISABLE - Tắt user thông qua email và username
exports.disableUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email và username là bắt buộc',
      });
    }

    const user = await User.findOne({
      email,
      username,
      isDeleted: false,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại hoặc thông tin không đúng',
      });
    }

    user.status = false;
    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({
      success: true,
      message: 'Vô hiệu hoá user thành công',
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET - Lấy tất cả users của một role theo role ID
exports.getUsersByRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    // Kiểm tra role có tồn tại không
    const role = await Role.findById(roleId);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role không tồn tại',
      });
    }

    const users = await User.find({
      role: roleId,
      isDeleted: false,
    })
      .populate('role', 'name description')
      .select('-password');

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách users của role thành công',
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
