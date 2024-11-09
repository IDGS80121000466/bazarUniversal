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
      <section className="d-flex align-items-center justify-content-center gradient-custom-2" style={{ minHeight: '100vh', width: '100vw', paddingTop: '80px' }}>
        <div className="container">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-lg-10 mb-5">
              <div className="card rounded-3 text-black shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-center align-items-center mb-4">
                    <img src="/logo.png" style={{ width: '80px', marginRight: '15px' }} alt="logo" />
                    <h4 className="mb-1">Bazar Universal</h4>
                  </div>
                  <div className="mb-4 d-flex flex-wrap justify-content-center">
                    <label htmlFor="filtroVentas" className="me-3">Filtrar Ventas:</label>
                    <select id="filtroVentas" onChange={handleFiltroChange} value={filtro} className="form-select w-auto">
                      <option value="misCompras">Mis Compras</option>
                      <option value="todas">Ver todas las Ventas</option>
                    </select>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead className="table-dark text-center">
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
                          ventas.map((ventaObj) =>
                            ventaObj.detalles.map((detalle) => (
                              <tr key={detalle._id} className="text-center">
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
                          )
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">No hay compras registradas</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
