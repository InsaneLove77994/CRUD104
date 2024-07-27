const mongoose = require('mongoose'); // Importa mongoose para trabajar con MongoDB

// Define el esquema del usuario utilizando mongoose.Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String, // El tipo de dato es String
    required: true, // Campo requerido
    minlength: 3, // Longitud mínima de 3 caracteres
    maxlength: 50 // Longitud máxima de 50 caracteres
  },
  email: {
    type: String, // El tipo de dato es String
    required: true, // Campo requerido
    unique: true, // Debe ser único en la colección
    match: /^\S+@\S+\.\S+$/ // Debe coincidir con el formato de email
  },
  password: {
    type: String, // El tipo de dato es String
    required: true, // Campo requerido
    minlength: 6 // Longitud mínima de 6 caracteres
  },
  role: {
    type: String, // El tipo de dato es String
    enum: ['usuario', 'admin', 'vendedor'], // Debe ser uno de estos valores
    default: 'usuario' // Valor por defecto es 'usuario'
  }
});

// Crea el modelo de usuario utilizando el esquema definido
const User = mongoose.model('User', UserSchema);

module.exports = User; // Exporta el modelo de usuario
