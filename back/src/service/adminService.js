<<<<<<< HEAD
// service/adminService.js
const adminRepository = require('../repository/adminRepository');
=======
const User = require('../model');
>>>>>>> f8e15f2c1447716d86d48cbe3798a3128373f085

class AdminService {
  async getAllUsers(req, res) {
    try {
      console.log('👑 Admin - Récupération de tous les utilisateurs');
<<<<<<< HEAD
      const users = await adminRepository.findAll();
=======
      const users = await User.find().select('-password').sort({ createdAt: -1 });
>>>>>>> f8e15f2c1447716d86d48cbe3798a3128373f085
      
      console.log(`✅ ${users.length} utilisateurs trouvés`);
      return res.json({
        success: true,
        count: users.length,
        users: users
      });
    } catch (error) {
      console.error('❌ Erreur getAllUsers:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs'
      });
    }
  }

  async getStats(req, res) {
    try {
      console.log('👑 Admin - Récupération des statistiques');
      
<<<<<<< HEAD
      const [totalUsers, totalAdmins, totalRegularUsers, recentUsers] = await Promise.all([
        adminRepository.countDocuments(),
        adminRepository.countDocuments({ isAdmin: true }),
        adminRepository.countDocuments({ isAdmin: false }),
        adminRepository.findRecentUsers(5)
      ]);
=======
      const totalUsers = await User.countDocuments();
      const totalAdmins = await User.countDocuments({ isAdmin: true });
      const totalRegularUsers = await User.countDocuments({ isAdmin: false });
      
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName email createdAt isAdmin');
>>>>>>> f8e15f2c1447716d86d48cbe3798a3128373f085

      return res.json({
        success: true,
        stats: {
          totalUsers,
          totalAdmins,
          totalRegularUsers,
          recentUsers
        }
      });
    } catch (error) {
      console.error('❌ Erreur getStats:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques'
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
<<<<<<< HEAD
      const updateData = { ...req.body };

      console.log(`👑 Admin - Modification de l'utilisateur: ${id}`, updateData);

      // Empêcher la modification du mot de passe via cette route
=======
      const updateData = req.body;

      console.log(`👑 Admin - Modification de l'utilisateur: ${id}`, updateData);

>>>>>>> f8e15f2c1447716d86d48cbe3798a3128373f085
      if (updateData.password) {
        delete updateData.password;
      }

<<<<<<< HEAD
      const user = await adminRepository.updateById(id, updateData);
=======
      const user = await User.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      ).select('-password');
>>>>>>> f8e15f2c1447716d86d48cbe3798a3128373f085

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      console.log(`✅ Utilisateur modifié: ${user.email}`);
      return res.json({
        success: true,
        message: 'Utilisateur modifié avec succès',
        user: user
      });
    } catch (error) {
      console.error('❌ Erreur updateUser:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la modification'
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      console.log(`👑 Admin - Suppression de l'utilisateur: ${id}`);

<<<<<<< HEAD
      // Empêcher l'auto-suppression
=======
>>>>>>> f8e15f2c1447716d86d48cbe3798a3128373f085
      if (id === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Vous ne pouvez pas supprimer votre propre compte'
        });
      }

<<<<<<< HEAD
      const user = await adminRepository.deleteById(id);
=======
      const user = await User.findByIdAndDelete(id);
>>>>>>> f8e15f2c1447716d86d48cbe3798a3128373f085

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      console.log(`✅ Utilisateur supprimé: ${user.email}`);
      return res.json({
        success: true,
        message: 'Utilisateur supprimé avec succès',
        deletedUser: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      console.error('❌ Erreur deleteUser:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression'
      });
    }
  }
}

module.exports = new AdminService();