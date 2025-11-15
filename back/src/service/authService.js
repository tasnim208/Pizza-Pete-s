const authRepository = require('../repository/authRepository');
const { generateToken } = require('../config/jwt');

class AuthService {
  async register(req, res) {
    try {
      console.log('📝 Tentative d\'inscription utilisateur avec:', req.body);
      const { firstName, lastName, email, address, city, state, password } = req.body;

      const existingUser = await authRepository.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà',
        });
      }

      const user = await authRepository.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        password: password,
        isAdmin: false
      });

      const token = generateToken(user._id);

      console.log('🎉 NOUVEL UTILISATEUR INSCRIT:');
      console.log('📧 Email:', user.email);
      console.log('👤 Nom:', user.firstName, user.lastName);
      console.log('🆔 ID:', user._id);
      console.log('👑 Admin:', user.isAdmin);

      return res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès ! 🎉',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          city: user.city,
          state: user.state,
          isAdmin: user.isAdmin,
        },
        token: token,
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: messages.join(', '),
        });
      }
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà',
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de l\'inscription',
      });
    }
  }

  async registerAdmin(req, res) {
    try {
      console.log('📝 Tentative d\'inscription admin avec:', req.body);
      const { firstName, lastName, email, address, city, state, password } = req.body;

      const existingUser = await authRepository.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà',
        });
      }

      const userData = {
        email: email.toLowerCase().trim(),
        password: password,
        isAdmin: true
      };

      if (firstName) userData.firstName = firstName.trim();
      if (lastName) userData.lastName = lastName.trim();
      if (address) userData.address = address.trim();
      if (city) userData.city = city.trim();
      if (state) userData.state = state.trim();

      const user = await authRepository.create(userData);

      const token = generateToken(user._id);

      console.log('👑 NOUVEL ADMIN INSCRIT:');
      console.log('📧 Email:', user.email);
      console.log('👤 Nom:', user.firstName, user.lastName);
      console.log('🆔 ID:', user._id);
      console.log('👑 Admin:', user.isAdmin);

      return res.status(201).json({
        success: true,
        message: 'Administrateur créé avec succès ! 👑',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          city: user.city,
          state: user.state,
          isAdmin: user.isAdmin,
        },
        token: token,
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription admin:', error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: messages.join(', '),
        });
      }
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà',
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de l\'inscription admin',
      });
    }
  }

  async login(req, res) {
    try {
      console.log('🔐 Tentative de connexion avec:', req.body.email);
      const { email, password } = req.body;

      const user = await authRepository.findByEmail(email);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: 'Email ou mot de passe incorrect' });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ success: false, message: 'Email ou mot de passe incorrect' });
      }

      const token = generateToken(user._id);
      console.log('✅ UTILISATEUR CONNECTÉ:', user.email);
      console.log('👑 Rôle:', user.isAdmin ? 'Admin' : 'User');

      return res.json({
        success: true,
        message: user.isAdmin ? 'Connexion admin réussie ! 👑' : 'Connexion réussie ! 🎉',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          city: user.city,
          state: user.state,
          isAdmin: user.isAdmin,
        },
        token: token,
      });
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      return res
        .status(500)
        .json({ success: false, message: 'Erreur serveur lors de la connexion' });
    }
  }

  async getUsers(req, res) {
    try {
      console.log('👥 Requête pour voir tous les utilisateurs');
      const users = await authRepository.findAll();
      console.log(`✅ ${users.length} utilisateurs trouvés`);
      return res.json({ success: true, count: users.length, users: users });
    } catch (error) {
      console.error('❌ Erreur getUsers:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs',
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await authRepository.findById(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'Utilisateur non trouvé' });
      }
      return res.json({ success: true, user: user });
    } catch (error) {
      console.error('❌ Erreur getProfile:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil',
      });
    }
  }
}

module.exports = new AuthService();