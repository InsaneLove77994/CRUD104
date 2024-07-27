const express = require('express'); // Importa express para crear un router
const { register, login, updateUser } = require('../controllers/authController'); // Importa los controladores de autenticación
const authMiddleware = require('../middleware/authMiddleware'); // Importa el middleware de autenticación

const router = express.Router(); // Crea una instancia de router

// Define la ruta para registrar usuarios y asigna el controlador 'register'
router.post('/register', register);

// Define la ruta para iniciar sesión y asigna el controlador 'login'
router.post('/login', login);

// Ruta protegida de ejemplo, utiliza el middleware de autenticación
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ mensaje: 'Accediste a una ruta protegida', user: req.user }); // Retorna un mensaje de éxito y los datos del usuario
});

// Ruta protegida para actualizar datos del usuario, utiliza el middleware de autenticación
router.put('/update', authMiddleware, updateUser);

module.exports = router; // Exporta el router
