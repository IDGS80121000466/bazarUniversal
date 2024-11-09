import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/Login"
import './App.css';
import PrivateRoute from "./components/PrivateRoute";
import '@fortawesome/fontawesome-free/css/all.min.css';
import DetalleProducto from "./components/DetalleProducto";
import Compras from "./components/Compras";


const App = () => {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/detalleProducto/:id" element={<PrivateRoute element={<DetalleProducto />} />} />
        <Route path="/compras" element={<PrivateRoute element={<Compras />} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
