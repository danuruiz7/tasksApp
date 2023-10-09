import Home from './pages/Home';
import NavbarCustom from './pages/Navbar';
import { Route, Routes } from 'react-router-dom';
import Registrar from './pages/Registrar';
import Login from './pages/Login';
import Layout from './Layout/Layout';
import ListaTarea from './pages/ListaTarea';
import CrearTareas from './components/CrearTareas';
import Protected from './components/Protected';

const AppRouter = () => {
  return (
    <>
      {/* Componente de barra de navegación */}
      <NavbarCustom />
      {/* Diseño general de la aplicación */}
      <Layout>
        {/* Configuración de rutas utilizando el componente Routes */}
        <Routes>
          {/* Rutas públicas accesibles sin autenticación */}
          <Route path="/" element={<Home />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas que requieren autenticación */}
          <Route element={<Protected />}>
            {/* Rutas internas de las rutas protegidas */}
            <Route path="/crear-tarea" element={<CrearTareas />} />
            <Route path="/lista-tareas" element={<ListaTarea />} />
          </Route>

          {/* Ruta de redirección para URLs incorrectas o no encontradas */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </>
  );
};

export default AppRouter;
