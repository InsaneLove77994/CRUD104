const express = require('express');
const conectarDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Conectar a la base de datos
conectarDB();

// Crear una instancia de Express
const app = express();

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Usar rutas de autenticación
app.use('/api/auth', authRoutes);

// Configurar el puerto en el que escuchará el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});