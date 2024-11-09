import { Navigate } from 'react-router-dom';
const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return element;
};

export default PrivateRoute;
