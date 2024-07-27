const bcrypt = require('bcryptjs'); // Importa bcryptjs para el hash de contraseñas
const Joi = require('joi'); // Importa Joi para la validación de datos
const User = require('../models/User'); // Importa el modelo de usuario
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken para la generación de tokens JWT

// Esquema de validación para el registro de usuarios
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(), // Nombre de usuario debe tener entre 3 y 50 caracteres
  email: Joi.string().email().required(), // Email debe ser válido y requerido
  password: Joi.string().min(6).required() // Contraseña debe tener al menos 6 caracteres
});

// Función de registro de usuario
exports.register = async (req, res) => {
  // Valida los datos de la solicitud contra el esquema de registro
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message }); // Si hay un error de validación, retorna un error 400

  const { username, email, password } = req.body;

  try {
    // Verifica si ya existe un usuario con el email proporcionado
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'El usuario ya existe' }); // Si el usuario ya existe, retorna un error 400
    
    // Crea un nuevo usuario con los datos proporcionados
    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10) // Hashea la contraseña antes de guardarla
    });

    await user.save(); // Guarda el usuario en la base de datos
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' }); // Retorna un mensaje de éxito
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' }); // Retorna un error 500 si hay un problema del servidor
  }
};

// Esquema de validación para el inicio de sesión
const loginSchema = Joi.object({
  email: Joi.string().email().required(), // Email debe ser válido y requerido
  password: Joi.string().min(6).required() // Contraseña debe tener al menos 6 caracteres
});

// Función de inicio de sesión de usuario
exports.login = async (req, res) => {
  // Valida los datos de la solicitud contra el esquema de inicio de sesión
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message }); // Si hay un error de validación, retorna un error 400

  const { email, password } = req.body;

  try {
    // Busca un usuario con el email proporcionado
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' }); // Si el usuario no existe, retorna un error 400

    // Compara la contraseña proporcionada con la contraseña almacenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' }); // Si las contraseñas no coinciden, retorna un error 400

    // Genera un token JWT con el ID del usuario
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token }); // Retorna un mensaje de éxito y el token
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' }); // Retorna un error 500 si hay un problema del servidor
  }
};

// Esquema de validación para la actualización de datos del usuario
const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(50), // Nombre de usuario debe tener entre 3 y 50 caracteres
  email: Joi.string().email(), // Email debe ser válido
  password: Joi.string().min(6) // Contraseña debe tener al menos 6 caracteres
});

// Función de actualización de datos del usuario
exports.updateUser = async (req, res) => {
  // Valida los datos de la solicitud contra el esquema de actualización
  const { error } = updateUserSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message }); // Si hay un error de validación, retorna un error 400

  const updates = req.body;

  try {
    // Si se proporciona una nueva contraseña, hashearla antes de guardarla
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Actualiza el usuario con los nuevos datos
    const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' }); // Si el usuario no se encuentra, retorna un error 404

    res.status(200).json({ mensaje: 'Datos del usuario actualizados exitosamente', user }); // Retorna un mensaje de éxito y los datos actualizados del usuario
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' }); // Retorna un error 500 si hay un problema del servidor
  }
};