// repository/userRepository.js
const User = require('../model/User');

class UserRepository {
  async findById(id, includePassword = false) {
    if (includePassword) {
      return await User.findById(id);
    }
    return await User.findById(id).select('-password');
  }

  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');
  }

  async updatePassword(id, newPassword) {
    const user = await User.findById(id);
    if (user) {
      user.password = newPassword;
      await user.save();
      return user;
    }
    return null;
  }

}

module.exports = new UserRepository();