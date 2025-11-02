const User = require('../model');
const bcrypt = require('bcryptjs');

class UserService {
  
   //Récupérer le profil de l'utilisateur connecté
   
  async getProfile(req, res) {
    try {
      console.log('👤 Récupération du profil pour:', req.user.email);
      
      const user = await User.findById(req.user._id).select('-password');
      
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

      // Récupérer l'utilisateur avec le mot de passe 
      const user = await User.findById(userId);

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

      if (newPassword) {
        // Vérifier que le mot de passe actuel est fourni
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

        // Hasher le nouveau mot de passe
       user.password = newPassword;
       await user.save();
        console.log('🔐 Mot de passe mis à jour');
      }

     
      // Effectuer la mise à jour
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { 
          new: true, 
          runValidators: true 
        }
      ).select('-password');

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
      
      // Gestion des erreurs de validation Mongoose
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

 // Supprimer le compte de l'utilisateur connecté
   
  async deleteAccount(req, res) {
    try {
      const userId = req.user._id;
      const { password } = req.body;

      console.log('🗑️ Demande de suppression de compte pour:', req.user.email);

      // Vérifier que le mot de passe est fourni
      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe est requis pour supprimer le compte'
        });
      }

      // Récupérer l'utilisateur avec le mot de passe
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Mot de passe incorrect'
        });
      }

      // Empêcher les admins de supprimer leur compte via cette route
      if (user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Les administrateurs ne peuvent pas supprimer leur compte via cette route'
        });
      }

      // Supprimer le compte
      await User.findByIdAndDelete(userId);

      console.log('✅ Compte supprimé avec succès:', user.email);
      return res.json({
        success: true,
        message: 'Votre compte a été supprimé avec succès'
      });
    } catch (error) {
      console.error('❌ Erreur deleteAccount:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du compte'
      });
    }
  }
}

module.exports = new UserService();