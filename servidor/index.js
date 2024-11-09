
const express = require('express');
const conectBD = require('./db.js');
const UsuarioModel = require('./models/Usuario.js')
const ProductoModel = require('./models/Producto');
const VentaModel = require('./models/Venta.js');
const DetalleVentaModel = require('./models/DetalleVenta.js');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const mongoose = require('mongoose');


const app = express();
app.use(express.json());
app.use(cors());
conectBD().then(() => {
    const cargarProductos = async () => {
        try {
            const collectionExists = await mongoose.connection.db.listCollections({ name: 'productos' }).hasNext();
            if (!collectionExists) {
                const productosData = JSON.parse(fs.readFileSync('data/products.json', 'utf-8')).products;
                await ProductoModel.insertMany(productosData);
                console.log('Productos insertados correctamente');
            } else {
                console.log('La colección "productos" ya existe. No se insertaron productos.');
            }
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    };
    cargarProductos();
}).catch((error) => {
    console.error('Error al iniciar el servidor:', error);
});

// Ruta de Registro de Usuario
app.post('/api/registrarUsuario', async (req, res) => {
    const { nombre, apellidoPaterno, apellidoMaterno, usuario, contrasenia } = req.body;
    try {
      const usuarioExistente = await UsuarioModel.findOne({ usuario });
      if (usuarioExistente) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }
      const salt = await bcrypt.genSalt(10);
      const contraseniaEncriptada = await bcrypt.hash(contrasenia, salt);
      const nuevoUsuario = new UsuarioModel({
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        usuario,
        contrasenia: contraseniaEncriptada,
      });
      await nuevoUsuario.save();
      return res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      res.status(500).json({ message: 'Error al registrar usuario' });
    }
  });
  
  // Ruta de Login de Usuario
  app.post('/api/login', async (req, res) => {
    const { usuario, contrasenia } = req.body;
    try {
      const usuarioEncontrado = await UsuarioModel.findOne({ usuario });
      if (!usuarioEncontrado) {
        return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
      }
      const esContraseniaValida = await bcrypt.compare(contrasenia, usuarioEncontrado.contrasenia);
      if (!esContraseniaValida) {
        return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
      }
      const token = jwt.sign({ id: usuarioEncontrado._id }, 'secretoJWT', { expiresIn: '1h' });
      return res.json({
        message: 'Inicio de sesión exitoso',
        token,
        usuario: {
          id: usuarioEncontrado._id,
          nombre: usuarioEncontrado.nombre,
          apellidoPaterno: usuarioEncontrado.apellidoPaterno,
          apellidoMaterno: usuarioEncontrado.apellidoMaterno,
          usuario: usuarioEncontrado.usuario,
        },
      });
    } catch (error) {
      console.error("Error al hacer login:", error);
      res.status(500).json({ message: 'Error al hacer login' });
    }
  });
  
  // Ruta para obtener las categorías únicas
  app.get('/api/getCategorias', async (req, res) => {
    try {
        const categorias = await ProductoModel.distinct('category');
        if (categorias.length === 0) {
            return res.status(404).json({ error: 'No se encontraron categorías.' });
        }
        return res.json({ categorias });
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        return res.status(500).json({ error: "Error al obtener las categorías", detalles: error.message });
    }
});
  app.get('/api/productos', async (req, res) => {
    try {
      const productos = await ProductoModel.find();
      return res.json({ productos });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ error: "Error al obtener productos" });
    }
  });

  app.get('/api/buscarProductos', async (req, res) => {
    const { buscar } = req.query;
    try {
      if (!buscar) {
        return res.status(400).json({ error: 'Debe proporcionar un término de búsqueda.' });
      }
      const productos = await ProductoModel.find({
        $or: [
          { title: { $regex: buscar, $options: 'i' } },
          { description: { $regex: buscar, $options: 'i' } }, 
          { price: { $regex: buscar, $options: 'i' } }, 
          { category: { $regex: buscar, $options: 'i' } } 
        ]
      });
      if (productos.length === 0) {
        return res.status(404).json({ message: 'No se encontraron productos que coincidan con la búsqueda.' });
      }  
      return res.json({ productos }); 
    } catch (error) {
      console.error('Error al buscar productos:', error);
      res.status(500).json({ error: 'Error al realizar la búsqueda de productos' });
    }
  });
// Ruta para obtener el detalle de un producto por el id en parámetros de consulta
app.get('/api/detalleProducto', async (req, res) => {
    const { id } = req.query; 
    try {
        const producto = await ProductoModel.findOne({ id: id }) || await ProductoModel.findById(id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        return res.json({ producto });
    } catch (error) {
        console.error('Error al obtener el detalle del producto:', error);
        res.status(500).json({ error: 'Error al obtener el detalle del producto' });
    }
});

// Ruta para registrar una venta con su detalle
app.post('/api/registrarVenta', async (req, res) => {
    const { usuarioId, productos } = req.body; // productos es un array de objetos con productoId y cantidad
    try {
        const total = await Promise.all(
            productos.map(async (item) => {
                const producto = await ProductoModel.findById(item.productoId);
                if (!producto) throw new Error('Producto no encontrado');
                return producto.price * item.cantidad;
            })
        ).then(totales => totales.reduce((acc, cur) => acc + cur, 0));
        const nuevaVenta = new VentaModel({
            usuarioId,
            total
        });
        await nuevaVenta.save();
        for (const item of productos) {
            const producto = await ProductoModel.findById(item.productoId);
            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            if (producto.stock < item.cantidad) {
                return res.status(400).json({ message: `Stock insuficiente para el producto ${producto.title}` });
            }
            producto.stock -= item.cantidad;
            await producto.save();
            const detalleVenta = new DetalleVentaModel({
                ventaId: nuevaVenta._id,
                productoId: item.productoId,
                cantidad: item.cantidad,
                precio: producto.price
            });
            await detalleVenta.save();
        }
        return res.status(201).json({ message: 'Venta registrada exitosamente' });
    } catch (error) {
        console.error('Error al registrar la venta:', error);
        res.status(500).json({ message: 'Error al registrar la venta' });
    }
});

// Ruta para obtener las ventas y detalles por usuario
app.get('/api/ventasPorUsuario', async (req, res) => {
    const { usuarioId } = req.query;
    if (!usuarioId) {
        return res.status(400).json({ error: 'Se requiere el ID del usuario' });
    }
    try {
        const ventas = await VentaModel.find({ usuarioId })
            .populate({ path: 'usuarioId', model: 'Usuario', select: 'nombre apellidoPaterno apellidoMaterno' })
            .exec();

        if (ventas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ventas para este usuario' });
        }
        const detallesVentas = await Promise.all(
            ventas.map(async (venta) => {
                const detalles = await DetalleVentaModel.find({ ventaId: venta._id })
                    .populate('productoId', 'title')
                    .exec();
                return {
                    venta,
                    detalles
                };
            })
        );

        res.json({ detallesVentas });
    } catch (error) {
        console.error('Error al obtener las ventas del usuario:', error);
        res.status(500).json({ error: 'Error al obtener las ventas del usuario' });
    }
});

// Ruta para obtener las ventas y detalles
app.get('/api/ventas', async (req, res) => {
    try {
        const ventas = await VentaModel.find()
            .populate({ path: 'usuarioId', model: 'Usuario', select: 'nombre apellidoPaterno apellidoMaterno' })
            .exec();

        if (ventas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ventas' });
        }
        const detallesVentas = await Promise.all(
            ventas.map(async (venta) => {
                const detalles = await DetalleVentaModel.find({ ventaId: venta._id })
                    .populate('productoId', 'title')
                    .exec();
                return {
                    venta,
                    detalles
                };
            })
        );

        res.json({ detallesVentas });
    } catch (error) {
        console.error('Error al obtener las ventas:', error);
        res.status(500).json({ error: 'Error al obtener las ventas' });
    }
});

  

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
