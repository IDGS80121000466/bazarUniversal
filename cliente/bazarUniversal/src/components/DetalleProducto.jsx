
import axios from 'axios';
import { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import SwalAlert from 'sweetalert2';
import NavBar from './NavBar';
function DetalleProducto() {
    const navigate = useNavigate();
    const [cantidad, setCantidad] = useState(1);
    const { id } = useParams(); 
    const [producto, setProducto] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`https://bazaruniversal.onrender.com/api/detalleProducto?id=${id}`);
        console.log(response.data); 
        setProducto(response.data.producto); 
      } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
        SwalAlert.fire({icon: 'error',title: 'Error al cargar el producto',text: error.response ? error.response.data : error.message,});
      }
    };
    fetchProducto();
  }, [id]);
  

      const handleCantidadChange = (increment) => {
        setCantidad((prevCantidad) => {
          if (increment) {
            return prevCantidad < producto.stock ? prevCantidad + 1 : prevCantidad;
          } else {
            return prevCantidad > 1 ? prevCantidad - 1 : prevCantidad;
          }
        });
      };
      const renderRating = (rating) => {
        const estrellas = [];
        for (let i = 1; i <= 5; i++) {
          if (i <= Math.floor(rating)) {
            estrellas.push(<i className="fas fa-star text-warning"></i>);
          } else if (i === Math.floor(rating) + 1 && rating % 1 >= 0.5) {
            estrellas.push(<i className="fas fa-star-half-alt text-warning"></i>);
          } else {
            estrellas.push(<i className="far fa-star text-secondary"></i>);
          }
        }
        return estrellas;
      };
      
      const handleComprar = async () => {
        try {
          const usuario = JSON.parse(localStorage.getItem('usuario'));
          if (!usuario || !usuario.id) {
            SwalAlert.fire({icon: 'error',title: 'Error',text: 'Debes iniciar sesión para realizar una compra.'});
            return;
          }
          const ventaData = {
            usuarioId: usuario.id,
            productos: [
              {
                productoId: producto._id,
                cantidad: cantidad
              }
            ]
          };
          const response = await axios.post(
            'https://bazaruniversal.onrender.com/api/registrarVenta',
            ventaData,
            { headers: { 'Content-Type': 'application/json' } }
          );
          if (response.status === 201) {
            SwalAlert.fire({icon: 'success',title: 'Compra realizada', text: 'Gracias por tu compra.', showConfirmButton: false, timer: 2000 });
            navigate('/home'); // Redirigir al usuario a la página principal
          } else {
            throw new Error('Error al registrar la venta');
          }
        } catch (error) {
          console.error('Error al realizar la compra:', error);
          SwalAlert.fire({ icon: 'error',title: 'Error al comprar',text: error.response?.data?.message || 'Error desconocido'});
        }
      };
      
      if (!producto) {
        return (
          <div> 
            <h2>Cargando...</h2>
          </div>
        );
      }
      return (
        <>
          <NavBar></NavBar>
    
          <section className="d-flex align-items-center justify-content-center gradient-custom-2" style={{ minHeight: '100vh', width: '100vw' }}>
            <div className="py-5 h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-xl-10 mb-5">
                  <div className="card rounded-3 text-black box-shadow">
                    <div className="row g-0 position-relative">
                      <div className="col-lg-12 text-center p-4">
                        <div className="d-flex justify-content-center align-items-center">
                          <img src="/logo.png" style={{ width: '120px', marginRight: '20px' }} alt="logo" />
                          <h4 className="mt-1 mb-5 pb-1 bazar-title">Bazar Universal</h4>
                        </div>
                      </div>
                      <div className="row mt-10">
                        <div className="col-md-12 mb-12 product-card">
                            <div className="card shadow-sm">
                            <img src={producto.thumbnail} className="card-img-top" alt={producto.title} style={{ height: '300px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h1 className="card-title justify-content-center">{producto.title}</h1>
                                <p className="card-text"><strong>Marca: </strong>{producto.brand}</p>
                                <p className="card-text">{producto.description}</p>
                                <p className="card-text"><strong>Categoria: </strong>{producto.category}</p>
                                <p className="card-text"><strong>Precio: </strong><span style={{ color: 'red', fontWeight: 'bold' }}>${producto.price}</span></p>
                                <p className="card-text"><strong>Descuento: </strong>%{producto.discountPercentage}</p>
                                <p className="card-text"><strong>Stock: </strong><span style={{ color: 'green', fontWeight: 'bold' }}>{producto.stock}</span></p>
                                <div>{renderRating(producto.rating)}</div>
                                <div className="mt-3">
                                    <h6>Otras Imágenes</h6>
                                    <div className="d-flex flex-wrap">
                                        {producto.images && producto.images.length > 0 ? (
                                            producto.images.map((imagen, index) => (
                                                <div className="mb-3" key={index} style={{ width: '150px', marginRight: '15px' }}>
                                                    <img src={imagen} alt={`Imagen adicional ${index + 1}`} className="img-thumbnail w-100 h-100" style={{ objectFit: 'cover' }} />
                                                </div>
                                            ))
                                        ) : (
                                            <p>No hay imágenes adicionales disponibles.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4">
                                  <button className="btn btn-outline-secondary" onClick={() => handleCantidadChange(false)}disabled={cantidad === 1}>-</button>
                                  <span className="mx-3">{cantidad}</span>
                                  <button  className="btn btn-outline-secondary"  onClick={() => handleCantidadChange(true)} disabled={cantidad === producto.stock}>+</button>
                                </div>
                                <div className="mt-4">
                                  <button className="btn btn-primary" onClick={handleComprar}>Comprar</button>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>   
                    <br></br>  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      );
}

export default DetalleProducto
