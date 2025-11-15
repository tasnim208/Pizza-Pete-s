// === Importations ===
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// === Configuration de l'app ===
const app = express();

// === MIDDLEWARES GLOBAUX ===
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// === Import des routes ===
const authRouter = require('./router/authRouter');
const adminRouter = require('./router/adminRouter');
const userRouter = require('./router/userRouter'); 
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

// === Route de test ===
app.get('/', (req, res) => {
  res.json({ 
    message: '🍕 Backend Pizza Pete’s fonctionne !', 
    status: 'OK',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Inscription utilisateur',
        'POST /api/auth/register-admin': 'Inscription admin',
        'POST /api/auth/login': 'Connexion',
        'GET /api/auth/users': 'Liste des utilisateurs',
        'GET /api/auth/profile': 'Profil utilisateur'
      },
      user: { 
        'GET /api/user/profile': 'Récupérer son profil (JWT requis)',
        'PUT /api/user/profile': 'Modifier son profil (JWT requis)',
        'DELETE /api/user/account': 'Supprimer son compte (JWT requis)'
      },
      admin: {
        'GET /api/admin/users': 'Liste tous les users (Admin)',
        'GET /api/admin/stats': 'Statistiques (Admin)',
        'PUT /api/admin/users/:id': 'Modifier user (Admin)',
        'DELETE /api/admin/users/:id': 'Supprimer user (Admin)'
      }
    }
  });
});

// === Gestion des routes non trouvées ===
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// === Gestion des erreurs ===
app.use((error, req, res, next) => {
  console.error('❌ Erreur globale:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

// === Démarrage du serveur ===
const startServer = async () => {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté !');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log('\n✨✨✨ SERVEUR DÉMARRÉ ✨✨✨');
      console.log(`📍 http://localhost:${PORT}`);
      console.log('==============================\n');
    });
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();