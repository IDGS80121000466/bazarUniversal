const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fechaVenta: { type: Date, default: Date.now },
  total: { type: Number, required: true }
}, { timestamps: true });

const VentaModel = mongoose.model('Venta', ventaSchema);
module.exports = VentaModel;
