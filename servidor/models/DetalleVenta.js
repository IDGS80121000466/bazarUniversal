const mongoose = require('mongoose');

const detalleVentaSchema = new mongoose.Schema({
  ventaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venta', required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true }
}, { timestamps: true });

const DetalleVentaModel = mongoose.model('DetalleVenta', detalleVentaSchema);
module.exports = DetalleVentaModel;
