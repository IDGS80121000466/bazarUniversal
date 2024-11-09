import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

function Login() {
  const [verLogin, setShowLogin] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); 

  const handleToggleForm = () => {
    setShowLogin(!verLogin);
  };

  const registrarUsuario = async (data) => {
    const res = await fetch('https://bazaruniversal.onrender.com/api/registrarUsuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Usuario registrado correctamente',
        showConfirmButton: false,
        timer: 1500,
      });
      setShowLogin(true);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Hubo un error',
        text: result.message || 'Error al registrar',
      });
    }
  };
  
  const loginUsuario = async (data) => {
    const res = await fetch('https://bazaruniversal.onrender.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok) {
      localStorage.setItem('usuario', JSON.stringify(result.usuario));
      localStorage.setItem('token', result.token);
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/home'); 
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Usuario o contraseña incorrectos',
        text: result.message || 'Revisa los datos ingresados',
      });
    }
  };

  return (
    <>
      <section className="h-100 gradient-form d-flex align-items-center justify-content-center" style={{ backgroundColor: '#eee' }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-10 mb-5">
              <div className="card rounded-3 text-black box-shadow">
                <div className="row g-0 position-relative">
                  <div className={`col-lg-6 ${verLogin ? 'order-1' : 'order-2'} transition`}>
                    <div className="card-body p-md-5 mx-md-4 fade-slide">
                      <div className="text-center">
                        <img src="/logo.png" style={{ width: '185px' }}alt="logo"/>
                        <h4 className="mt-1 mb-5 pb-1">Bazar Universal Emmanuel</h4>
                      </div>

                      {verLogin ? (
                        <form onSubmit={handleSubmit(loginUsuario)}>
                          <p>Por favor, inicie sesión en su cuenta</p>
                          <div className="form-outline mb-4">
                          <div className="form-floating bg-gradient" style={{ paddingLeft: '6px', backgroundColor: '#1c4c7b', borderRadius: '5px'}}>
                            <input type="text" id="usuario" className="form-control" placeholder="Ingresa tu Usuario" {...register('usuario', { required: 'El usuario es obligatorio' })} />
                            <label className="form-label" htmlFor="usuario">Usuario</label>
                          </div>
                            {errors.usuario && <span className="text-danger">{errors.usuario.message}</span>}
                          </div>
                          <div className="form-outline mb-4">
                            <div className="form-floating bg-gradient" style={{ paddingLeft: '6px', backgroundColor: '#1c4c7b', borderRadius: '5px'}}>
                            <input type="password" id="contrasenia" className="form-control" {...register('contrasenia', { required: 'La contraseña es obligatoria' })} />
                            <label className="form-label" htmlFor="contrasenia">Contraseña</label>
                          </div>
                            {errors.contrasenia && <span className="text-danger">{errors.contrasenia.message}</span>}
                          </div>
                          <div className="text-center pt-1 mb-5 pb-1">
                            <button className="btn btn-primary btn-block gradient-custom-2 mb-3" type="submit">Ingresar</button>
                          </div>
                          <div className="d-flex align-items-center justify-content-center pb-4">
                            <p className="mb-0 me-2">¿No tienes una cuenta?</p>
                            <button onClick={handleToggleForm} type="button" className="btn btn-outline-danger">Crea una</button>
                          </div>
                        </form>
                      ) : (
                        <form onSubmit={handleSubmit(registrarUsuario)}>
                          <p>Registra una nueva cuenta</p>
                          <div className="form-outline mb-4">
                              <div className="form-floating bg-gradient" style={{ paddingLeft: '6px', backgroundColor: '#1c4c7b', borderRadius: '5px'}}>
                                  <input id="nombre" type="text" className="form-control" placeholder="Nombre" {...register('nombre', { required: 'El nombre es obligatorio' })} />
                                  <label htmlFor="nombre"><span className="asterisco-rojo"></span>Nombre:</label>
                                  </div>
                                  {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
                              
                          </div>

                          <div className="form-outline mb-4">
                            <div className="form-floating bg-gradient" style={{ paddingLeft: '6px', backgroundColor: '#1c4c7b', borderRadius: '5px'}}>
                              <input type="text" id="apellidoPaterno" className="form-control" placeholder="Apellido Paterno" {...register('apellidoPaterno', { required: 'El apellido paterno es obligatorio' })} />
                              <label className="form-label" htmlFor="apellidoPaterno">Apellido Paterno</label>
                              </div>
                              {errors.apellidoPaterno && <span className="text-danger">{errors.apellidoPaterno.message}</span>}
                              
                          </div>
                          <div className="form-outline mb-4">
                          <div className="form-floating bg-gradient" style={{ paddingLeft: '6px', backgroundColor: '#1c4c7b', borderRadius: '5px'}}>
                            <input type="text" id="apellidoMaterno" className="form-control" placeholder="Apellido Materno" {...register('apellidoMaterno', { required: 'El apellido materno es obligatorio' })} />
                            <label className="form-label" htmlFor="apellidoMaterno">Apellido Materno</label>
                            </div>
                            {errors.apellidoMaterno && <span className="text-danger">{errors.apellidoMaterno.message}</span>}
                          
                          </div>
                          <div className="form-outline mb-4">
                          <div className="form-floating bg-gradient" style={{ paddingLeft: '6px', backgroundColor: '#1c4c7b', borderRadius: '5px'}}>
                            <input type="text" id="nuevoUsuario" className="form-control" placeholder="Usuario" {...register('usuario', { required: 'El usuario es obligatorio' })} />
                            <label className="form-label" htmlFor="nuevoUsuario">Usuario</label>
                            </div>
                            {errors.usuario && <span className="text-danger">{errors.usuario.message}</span>}
                          
                          </div>
                          <div className="form-outline mb-4">
                          <div className="form-floating bg-gradient" style={{ paddingLeft: '6px', backgroundColor: '#1c4c7b', borderRadius: '5px'}}>
                            <input type="password" id="nuevaContrasenia" className="form-control" placeholder="Contraseña" {...register('contrasenia', { required: 'La contraseña es obligatoria' })} />
                            <label className="form-label" htmlFor="nuevaContrasenia">Contraseña</label>
                            </div>
                            {errors.contrasenia && <span className="text-danger">{errors.contrasenia.message}</span>}
                          
                          </div>
                          <div className="text-center pt-1 mb-5 pb-1">
                            <button className="btn btn-primary btn-block gradient-custom-2 mb-3" type="submit">
                              Crear
                            </button>
                          </div>
                          <div className="d-flex align-items-center justify-content-center pb-4">
                            <button onClick={handleToggleForm} type="button" className="btn btn-outline-secondary">
                              Volver al Inicio de Sesión
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>

                  <div className={`col-lg-6 d-flex align-items-center gradient-custom-2 ${verLogin ? 'order-2' : 'order-1'} transition fade-slide`}>
                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                      <h4 className="mb-4">Somos más que una empresa</h4>
                      <p className="small mb-0">En Bazar Universal, no solo somos un bazar, somos tu espacio de confianza donde encuentras productos para todas tus necesidades. Desde artículos para el hogar hasta los más innovadores productos, ofrecemos una experiencia de compra única, cómoda y accesible para todos. ¡Descubre un mundo de opciones para ti y tu familia!</p>
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

export default Login;