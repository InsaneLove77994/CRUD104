const jwt = require('jsonwebtoken'); // Importa jsonwebtoken para la verificación de tokens JWT

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  // Obtiene el token de la cabecera 'Authorization' y elimina la palabra 'Bearer '
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' }); // Si no hay token, retorna un error 401
  }
  try {
    // Verifica el token usando la clave secreta
    const verified = jwt.verify(token, 'your_jwt_secret');
    req.user = verified; // Asigna los datos verificados del token al objeto req.user
    next(); // Llama a la siguiente función middleware
  } catch (error) {
    res.status(400).json({ error: 'Token no válido' }); // Si el token no es válido, retorna un error 400
  }
};

module.exports = authMiddleware; // Exporta el middleware de autenticación
