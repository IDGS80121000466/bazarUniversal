import { useState, useEffect } from 'react';
import {  useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import NavBar from './NavBar';

function Home() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [searchParams] = useSearchParams();
    const [busqueda, setBusqueda] = useState(searchParams.get('buscar') || '');

    useEffect(() => {
      axios.get('https://bazaruniversal.onrender.com/api/getCategorias')
        .then(response => {
          setCategorias(response.data.categorias);
        })
        .catch(error => {
          console.error('Error al obtener las categorías:', error);
        });
  
      axios.get('https://bazaruniversal.onrender.com/api/productos')
        .then(response => {
          setProductos(response.data.productos);
        })
        .catch(error => {
          console.error('Error al obtener los productos:', error);
        });
    }, []);
  
    const handleCategoriaClick = (categoria) => {
      const productosFiltradosPorCategoria = productos.filter(producto => producto.category === categoria);
      setProductosFiltrados(productosFiltradosPorCategoria);
    };
  
    const handleMostrarTodos = () => {
      setProductosFiltrados(productos);
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

    useEffect(() => {
      const queryBusqueda = searchParams.get('buscar') || '';
      setBusqueda(queryBusqueda);
      if (queryBusqueda) {
        const productosFiltrados = productos.filter(producto =>
          producto.title.toLowerCase().includes(queryBusqueda.toLowerCase()) ||
          producto.description.toLowerCase().includes(queryBusqueda.toLowerCase())
        );
        setProductosFiltrados(productosFiltrados);
      } else {
        //setProductosFiltrados(productos); 
      }
    }, [searchParams, productos]); 
  
    const handleBuscar = async (value) => {
      navigate(`?buscar=${value}`);
    };
  
    const handleInputChange = (event) => {
      const value = event.target.value;
      setBusqueda(value);
  
      if (value.trim() === '') {
        setProductosFiltrados(productos); 
      } else {
        handleBuscar(value); 
      }
    };
  

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

                  <div className="col-12 text-center mt-4">
                    <h5>Selecciona una categoría</h5>
                    <div className="d-flex justify-content-center gap-3 mt-3 category-buttons">
                      <button className="btn btn-outline-primary category-btn" onClick={handleMostrarTodos}>Todos los productos</button>
                      {categorias.map((categoria, index) => (
                        <button key={index} className="btn btn-outline-primary category-btn" onClick={() => handleCategoriaClick(categoria)}>
                          {categoria}
                        </button>
                      ))}
                    </div>
                    <div className="d-flex justify-content-center gap-3 mt-3 category-buttons">
                    <div className="container mt-4">
                    <div className="form-floating bg-gradient" style={{ paddingLeft: '6px', backgroundColor: '#1c4c7b', borderRadius: '5px'}}>
                        <input type="text" className="form-control" placeholder="Buscar producto" value={busqueda} onChange={handleInputChange} />
                        <label className="form-label" htmlFor="buscar">Buscar</label>
                      </div>
                      <button className="btn btn-primary mt-2" onClick={() => handleBuscar(busqueda)}>Buscar</button>
                    </div>
                    </div>  
                  </div>

                    <div className="row mt-5">
                    {productosFiltrados.length > 0 ? (
                        productosFiltrados.map((producto) => (
                        <div key={producto.id} className="col-md-4 mb-4 product-card">
                            <div className="card shadow-sm">
                            <img src={producto.thumbnail} className="card-img-top" alt={producto.title} style={{ height: '200px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title">{producto.title}</h5>
                                <p className="card-text">{producto.description}</p>
                                <p className="card-text"><strong>Categoria: </strong>{producto.category}</p>
                                <p className="card-text"><strong>Precio: </strong><span style={{ color: 'red', fontWeight: 'bold' }}>${producto.price}</span></p>

                                <div className="d-flex justify-content-between align-items-center">
                                <div>{renderRating(producto.rating)}</div>
                                <button className="btn btn-outline-primary" onClick={() => navigate(`/detalleProducto/${producto.id}`)}> Ver Producto</button>
                                </div>
                            </div>
                            </div>
                        </div>
                        ))
                    ) : (
                        <p className="text-center">No se encontraron productos</p>
                    )}
                    </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
