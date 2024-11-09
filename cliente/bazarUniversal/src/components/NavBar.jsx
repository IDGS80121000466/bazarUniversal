import { useNavigate } from "react-router-dom";
import SwalAlert from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const NavBar = () => {
    const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    SwalAlert.fire({ icon: 'success', title: 'Has cerrado sesión', showConfirmButton: false, timer: 1500 });
    navigate('/');
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light  bg-light w-100" style={{ backgroundColor: '#e3f2fd'}}>
        <div className="container-fluid">
          <a className="navbar-brand" href="/home">Bazar Universal</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/home">Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/compras">Mis Compras</a>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger nav-link" onClick={handleLogout}>Cerrar Sesión</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavBar
