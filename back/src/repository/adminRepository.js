// repository/adminRepository.js
const User = require('../model');

class AdminRepository {
  async findAll() {
    return await User.find().select('-password').sort({ createdAt: -1 });
  }

  async countDocuments(query = {}) {
    return await User.countDocuments(query);
  }

  async findRecentUsers(limit = 5) {
    return await User.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('firstName lastName email createdAt isAdmin');
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
  }

  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }

  async isUserExists(id) {
    const user = await User.findById(id);
    return !!user;
  }
}

module.exports = new AdminRepository();