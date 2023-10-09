import { NavLink, useNavigate } from 'react-router-dom';
import estilos from './Navbar.module.css';
import { useVariablesGlobal } from '../ContextoGlobal/VariableGlobales';

// Componente funcional para la barra de navegación
function NavbarCustom() {
  // Obteniendo el estado de autenticación y la función de navegación desde el contexto global
  const { auth, setAuth, update } = useVariablesGlobal();
  const navigate = useNavigate();

  // Función para cerrar sesión
  const cerrarSesion = () => {
    // Actualizando el estado de autenticación y redirigiendo a la página de inicio de sesión
    setAuth({
      isAuthenticated: false,
      token: '',
      user: '',
    });
    navigate('/');
  };

  return (
    <header className={estilos.header}>
      <div className={estilos.container}>
        {/* Enlace al inicio o a la página de creación de tareas según el estado de autenticación */}
        <NavLink to={auth.isAuthenticated ? '/crear-tarea' : '/'}>
          <h3 className={estilos.title}>TasksApp</h3>
        </NavLink>

        {/* Menú de navegación con opciones condicionales basadas en el estado de autenticación */}
        <nav className={estilos.nav}>
          <ul className={estilos.menu}>
            {!auth.isAuthenticated ? (
              // Opciones de menú para usuarios no autenticados
              <>
                <NavLink to="/">Inicio</NavLink>
                <NavLink to="/registrar">Registrar</NavLink>
                <NavLink to="/login">Iniciar sesión</NavLink>
              </>
            ) : (
              // Opciones de menú para usuarios autenticados
              <>
                <NavLink to="/crear-tarea">
                  {/* Etiqueta dinámica para la opción de crear o editar según el estado de "update" */}
                  {update ? 'Editar' : 'Crear'}
                </NavLink>
                <NavLink to="/lista-tareas">Listar</NavLink>
                <NavLink to="/" onClick={cerrarSesion}>
                  Cerrar sesión
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
