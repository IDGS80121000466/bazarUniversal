const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number },
  rating: { type: Number },
  stock: { type: Number, required: true },
  brand: { type: String },
  category: { type: String },
  thumbnail: { type: String },
  images: { type: [String] }
}, { timestamps: true });

const ProductoModel = mongoose.model('Producto', productoSchema);
module.exports = ProductoModel;
