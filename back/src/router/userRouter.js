const express = require('express');
const userService = require('../service/userService');
const { authMiddleware } = require('../middleware/auth');
const { updateProfileSchema, validateRequest } = require('../schema');

const router = express.Router();

// Appliquer l'authentification à toutes les routes
router.use(authMiddleware);

/**
 * route   GET /api/user/profile
 * desc    Récupérer le profil de l'utilisateur connecté
 * access  Private (JWT requis)
 **/
router.get('/profile', (req, res) => userService.getProfile(req, res));

/**
 * route   PUT /api/user/profile
 * desc    Mettre à jour le profil de l'utilisateur connecté
 * access  Private (JWT requis)
 **/
router.put('/profile', validateRequest(updateProfileSchema), (req, res) => 
  userService.updateProfile(req, res)
);



module.exports = router;