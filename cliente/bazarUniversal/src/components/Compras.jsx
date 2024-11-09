import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwalAlert from 'sweetalert2';
import NavBar from './NavBar';

function Compras() {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState('misCompras');

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const usuarioId = usuario?.id;

  const obtenerVentas = async () => {
    if (!usuarioId) {
      SwalAlert.fire({ icon: 'error', title: 'Error', text: 'Usuario no encontrado' });
      navigate('/');
      return;
    }

    try {
      let url = 'https://bazaruniversal.onrender.com/api/ventas';
      if (filtro === 'misCompras') {
        url = `https://bazaruniversal.onrender.com/api/ventasPorUsuario?usuarioId=${usuarioId}`;
      }

      const response = await axios.get(url);
      if (response.data.detallesVentas) {
        setVentas(response.data.detallesVentas);
      }
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
      SwalAlert.fire({ icon: 'error', title: 'Error', text: 'No se pudieron obtener las ventas' });
    }
  };

  useEffect(() => {
    obtenerVentas();
  }, [filtro]);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  return (
    <>
      <NavBar />
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
                      <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="filtroVentas" style={{ marginRight: '10px' }}>Filtrar Ventas:</label>
                        <select id="filtroVentas" onChange={handleFiltroChange}value={filtro}style={{ padding: '5px' }}>
                          <option value="misCompras">Mis Compras</option>
                          <option value="todas">Ver todas las Ventas</option>
                        </select>
                      </div>

                      <div className="card shadow-sm">
                        <section className="container mt-5">
                          <h3>{filtro === 'misCompras' ? 'Mis Compras' : 'Todas las Ventas'}</h3>
                          <div className="table-responsive">
                            <table className="table table-bordered table-hover mt-4">
                              <thead className="table-dark">
                                <tr>
                                  <th>Fecha</th>
                                  <th>Usuario</th>
                                  <th>Productos</th>
                                  <th>Precio Unitario</th>
                                  <th>Cantidad</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ventas.length > 0 ? (
                                  ventas.map((ventaObj) => (
                                    ventaObj.detalles.map((detalle) => (
                                      <tr key={detalle._id}>
                                        <td>{new Date(ventaObj.venta.fechaVenta).toLocaleDateString()}</td>
                                        <td>
                                          {ventaObj.venta.usuarioId
                                            ? `${ventaObj.venta.usuarioId.nombre} ${ventaObj.venta.usuarioId.apellidoPaterno} ${ventaObj.venta.usuarioId.apellidoMaterno}`
                                            : 'Usuario no disponible'}
                                        </td>
                                        <td>{detalle.productoId?.title || 'Producto no disponible'}</td>
                                        <td>${detalle.precio.toFixed(2)}</td>
                                        <td>{detalle.cantidad}</td>
                                        <td>${ventaObj.venta.total.toFixed(2)}</td>
                                      </tr>
                                    ))
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="6" className="text-center">No hay compras registradas</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </section>
                      </div>
                    </div>
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

export default Compras;
