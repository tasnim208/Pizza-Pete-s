const express = require('express');
const userService = require('../service/userService');
const { authMiddleware } = require('../middleware/auth');
<<<<<<< HEAD
const { updateProfileSchema, validateRequest } = require('../schema');
=======
const { updateProfileSchema, deleteAccountSchema, validateRequest } = require('../schema');

>>>>>>> f8e15f2c1447716d86d48cbe3798a3128373f085

const router = express.Router();

// Appliquer l'authentification à toutes les routes
router.use(authMiddleware);

<<<<<<< HEAD
=======

>>>>>>> f8e15f2c1447716d86d48cbe3798a3128373f085
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

<<<<<<< HEAD

=======
/**
 * route   DELETE /api/user/account
 * desc    Supprimer le compte de l'utilisateur connecté
 * access  Private (JWT requis)
 **/
router.delete('/account', validateRequest(deleteAccountSchema), (req, res) => 
  userService.deleteAccount(req, res)
);
>>>>>>> f8e15f2c1447716d86d48cbe3798a3128373f085

module.exports = router;