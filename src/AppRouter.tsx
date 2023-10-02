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
      <NavbarCustom />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/login" element={<Login />} />
          {/* Rutas protegidas */}
          <Route element={<Protected />}>
            <Route path="/crear-tarea" element={<CrearTareas />} />
            <Route path="/lista-tareas" element={<ListaTarea />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </>
  );
};

export default AppRouter;
