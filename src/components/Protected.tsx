import { Outlet, Navigate } from 'react-router';
import { useVariablesGlobal } from '../ContextoGlobal/VariableGlobales';

// Componente protegido que verifica si el usuario está autenticado antes de mostrar su contenido
const Protected = () => {
  // Obtiene el estado de autenticación del contexto de variables globales
  const { auth } = useVariablesGlobal();
  // Si el usuario no está autenticado, redirige a la página de inicio de sesión
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si el usuario está autenticado, muestra el contenido anidado (Outlet) de las rutas protegidas
  return <Outlet></Outlet>;
};

export default Protected;
