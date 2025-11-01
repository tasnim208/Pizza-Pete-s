const express = require('express');
const adminService = require('../service/adminService');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Appliquer l'authentification et les droits admin à toutes les routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Récupérer tous les utilisateurs
router.get('/users', (req, res) => adminService.getAllUsers(req, res));

// Récupérer les statistiques
router.get('/stats', (req, res) => adminService.getStats(req, res));

// Modifier un utilisateur
router.put('/users/:id', (req, res) => adminService.updateUser(req, res));

// Supprimer un utilisateur
router.delete('/users/:id', (req, res) => adminService.deleteUser(req, res));

module.exports = router;