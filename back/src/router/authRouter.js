const express = require('express');
const authService = require('../service/authService');
const { registerSchema, adminRegisterSchema, loginSchema, validateRequest } = require('../schema');

const router = express.Router();

// Inscription utilisateur normal
router.post('/register', validateRequest(registerSchema), (req, res) =>
  authService.register(req, res)
);

// Inscription admin
router.post('/register-admin', validateRequest(adminRegisterSchema), (req, res) =>
  authService.registerAdmin(req, res)
);

// Connexion
router.post('/login', validateRequest(loginSchema), (req, res) =>
  authService.login(req, res)
);

// Liste des utilisateurs
router.get('/users', (req, res) => authService.getUsers(req, res));

// Profil utilisateur
router.get('/profile', (req, res) => authService.getProfile(req, res));

module.exports = router;