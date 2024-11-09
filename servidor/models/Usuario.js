const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidoPaterno: { type: String, required: true },
  apellidoMaterno: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
  contrasenia: { type: String, required: true }
}, { timestamps: true });

const UsuarioModel = mongoose.model('Usuario', usuarioSchema);
module.exports = UsuarioModel;
