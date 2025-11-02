const Joi = require('joi');

// Schéma pour l'inscription utilisateur
const registerSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le prénom est obligatoire',
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 50 caractères'
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le nom est obligatoire',
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 50 caractères'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'L\'email est obligatoire',
      'string.email': 'Format d\'email invalide'
    }),
  address: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.empty': 'L\'adresse est obligatoire',
      'string.min': 'L\'adresse doit contenir au moins 5 caractères'
    }),
  city: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'La ville est obligatoire',
      'string.min': 'La ville doit contenir au moins 2 caractères'
    }),
  state: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le département/état est obligatoire',
      'string.min': 'Le département/état doit contenir au moins 2 caractères'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Le mot de passe est obligatoire',
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères'
    }),
  isAdmin: Joi.boolean().default(false)
});

// Schéma pour l'inscription admin
const adminRegisterSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 50 caractères'
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 50 caractères'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'L\'email est obligatoire',
      'string.email': 'Format d\'email invalide'
    }),
  address: Joi.string()
    .min(5)
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.min': 'L\'adresse doit contenir au moins 5 caractères'
    }),
  city: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.min': 'La ville doit contenir au moins 2 caractères'
    }),
  state: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Le département/état doit contenir au moins 2 caractères'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Le mot de passe est obligatoire',
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères'
    }),
  isAdmin: Joi.boolean().default(true)
});

// Schéma pour la connexion
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'L\'email est obligatoire',
      'string.email': 'Format d\'email invalide'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Le mot de passe est obligatoire'
    })
});

// Schéma pour la mise à jour du profil
const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 50 caractères'
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 50 caractères'
    }),
  address: Joi.string()
    .min(5)
    .max(200)
    .optional()
    .messages({
      'string.min': 'L\'adresse doit contenir au moins 5 caractères',
      'string.max': 'L\'adresse ne peut pas dépasser 200 caractères'
    }),
  city: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'La ville doit contenir au moins 2 caractères',
      'string.max': 'La ville ne peut pas dépasser 100 caractères'
    }),
  state: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Le département/état doit contenir au moins 2 caractères',
      'string.max': 'Le département/état ne peut pas dépasser 50 caractères'
    }),
  currentPassword: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Le mot de passe actuel ne peut pas être vide'
    }),
  newPassword: Joi.string()
    .min(6)
    .optional()
    .messages({
      'string.min': 'Le nouveau mot de passe doit contenir au moins 6 caractères'
    })
}).min(1).messages({
  'object.min': 'Aucune donnée à mettre à jour'
}); // Au moins un champ doit être fourni

// Schéma pour la suppression de compte
const deleteAccountSchema = Joi.object({
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Le mot de passe est requis',
      'any.required': 'Le mot de passe est requis'
    })
});


// Middleware de validation
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      
     
      if (errorMessages.length === 1 && errorMessages[0] === 'Aucune donnée à mettre à jour') {
        return res.status(400).json({ 
          success: false, 
          message: errorMessages[0]
        });
      }
      
      return res.status(400).json({ 
        success: false, 
        message: 'Données invalides', 
        errors: errorMessages 
      });
    }
    req.body = value;
    next();
  };
};

module.exports = { 
  registerSchema, 
  adminRegisterSchema, 
  loginSchema, 
  updateProfileSchema,
  deleteAccountSchema,
  validateRequest 
};