const User = require('../model');

class AdminService {
  async getAllUsers(req, res) {
    try {
      console.log('👑 Admin - Récupération de tous les utilisateurs');
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      
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
      
      const totalUsers = await User.countDocuments();
      const totalAdmins = await User.countDocuments({ isAdmin: true });
      const totalRegularUsers = await User.countDocuments({ isAdmin: false });
      
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName email createdAt isAdmin');

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
      const updateData = req.body;

      console.log(`👑 Admin - Modification de l'utilisateur: ${id}`, updateData);

      if (updateData.password) {
        delete updateData.password;
      }

      const user = await User.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      ).select('-password');

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

      if (id === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Vous ne pouvez pas supprimer votre propre compte'
        });
      }

      const user = await User.findByIdAndDelete(id);

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