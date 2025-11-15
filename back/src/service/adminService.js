// service/adminService.js
const adminRepository = require('../repository/adminRepository');

class AdminService {
  async getAllUsers(req, res) {
    try {
      console.log('👑 Admin - Récupération de tous les utilisateurs');
      const users = await adminRepository.findAll();
      
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
      
      const [totalUsers, totalAdmins, totalRegularUsers, recentUsers] = await Promise.all([
        adminRepository.countDocuments(),
        adminRepository.countDocuments({ isAdmin: true }),
        adminRepository.countDocuments({ isAdmin: false }),
        adminRepository.findRecentUsers(5)
      ]);

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
      const updateData = { ...req.body };

      console.log(`👑 Admin - Modification de l'utilisateur: ${id}`, updateData);

      // Empêcher la modification du mot de passe via cette route
      if (updateData.password) {
        delete updateData.password;
      }

      const user = await adminRepository.updateById(id, updateData);

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

      // Empêcher l'auto-suppression
      if (id === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Vous ne pouvez pas supprimer votre propre compte'
        });
      }

      const user = await adminRepository.deleteById(id);

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