// service/userService.js
const userRepository = require('../repository/userRepository');

class UserService {
  
  // Récupérer le profil de l'utilisateur connecté
  async getProfile(req, res) {
    try {
      console.log('👤 Récupération du profil pour:', req.user.email);
      
      const user = await userRepository.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      console.log('✅ Profil récupéré avec succès');
      return res.json({
        success: true,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          city: user.city,
          state: user.state,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error('❌ Erreur getProfile:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil'
      });
    }
  }

  // Mettre à jour le profil de l'utilisateur connecté
  async updateProfile(req, res) {
    try {
      const userId = req.user._id;
      const { firstName, lastName, address, city, state, currentPassword, newPassword } = req.body;

      console.log('✏️ Mise à jour du profil pour:', req.user.email);

      // Récupérer l'utilisateur avec le mot de passe pour vérification
      const user = await userRepository.findById(userId, true);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Créer un objet avec les données à mettre à jour
      const updateData = {};

      if (firstName !== undefined) updateData.firstName = firstName.trim();
      if (lastName !== undefined) updateData.lastName = lastName.trim();
      if (address !== undefined) updateData.address = address.trim();
      if (city !== undefined) updateData.city = city.trim();
      if (state !== undefined) updateData.state = state.trim();

      // Gestion du changement de mot de passe
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            message: 'Le mot de passe actuel est requis pour changer le mot de passe'
          });
        }

        // Vérifier que le mot de passe actuel est correct
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Mot de passe actuel incorrect'
          });
        }

        if (newPassword.length < 6) {
          return res.status(400).json({
            success: false,
            message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
          });
        }

        // Mettre à jour le mot de passe via le repository
        await userRepository.updatePassword(userId, newPassword);
        console.log('🔐 Mot de passe mis à jour');
      }

      // Mettre à jour les autres données du profil
      const updatedUser = await userRepository.updateById(userId, updateData);

      console.log('✅ Profil mis à jour avec succès');
      return res.json({
        success: true,
        message: 'Profil mis à jour avec succès',
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          address: updatedUser.address,
          city: updatedUser.city,
          state: updatedUser.state,
          isAdmin: updatedUser.isAdmin,
          updatedAt: updatedUser.updatedAt
        }
      });
    } catch (error) {
      console.error('❌ Erreur updateProfile:', error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: messages
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du profil'
      });
    }
  }

  
}

module.exports = new UserService();