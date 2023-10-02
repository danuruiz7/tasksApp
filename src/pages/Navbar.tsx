import { NavLink, useNavigate } from 'react-router-dom';
import estilos from './Navbar.module.css';
import { useAuth } from '../auth/AuthContext';

function NavbarCustom() {
  const { auth, setAuth, update } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    setAuth({
      isAuthenticated: false,
      token: '',
      user: '',
    });
    navigate('/login');
  };

  return (
    <header className={estilos.header}>
      <div className={estilos.container}>
        <h3 className={estilos.title}>App Tareas</h3>
        <nav className={estilos.nav}>
          <ul className={estilos.menu}>
            {!auth.isAuthenticated ? (
              <>
                <NavLink to="/">Inicio</NavLink>
                <NavLink to="/registrar">Registrar</NavLink>
                <NavLink to="/login">Login</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/crear-tarea">
                  {update ? 'Editar Tarea' : 'Crear Tarea'}
                </NavLink>
                <NavLink to="/lista-tareas">Lista Tareas</NavLink>
                <NavLink to="/logout" onClick={cerrarSesion}>
                  Cerrar sesion
                </NavLink>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default NavbarCustom;
