import { useNavigate } from 'react-router';
import { useVariablesGlobal } from '../ContextoGlobal/VariableGlobales';
import estilos from './Form.module.css';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ErrorSpan from '../components/ErrorSpan';
import Loader from '../components/Loader';

// Interfaz para el estado de inicio de sesión
interface Login {
  username: string;
  password: string;
}

// Estado inicial para el formulario de inicio de sesión
const InicialState = {
  username: '',
  password: '',
};

// Componente funcional para el inicio de sesión
const Login = () => {
  // Obteniendo el contexto de autenticación y la URL donde se va hacer la petición
  const { setAuth, URL } = useVariablesGlobal();
  const navigate = useNavigate();

  // Estados para el formulario de inicio de sesión
  const [loginUser, setLoginUser] = useState(InicialState);
  // Estado para el error de inicio de sesión
  const [error, setError] = useState(false);
  // Estado para el cargando de inicio de sesión
  const [loading, setLoading] = useState(false);

  // Función para manejar cambios en los campos de entrada
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginUser({
      ...loginUser,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el envío del formulario de inicio de sesión
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Configuración de opciones para la solicitud de inicio de sesión
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginUser),
      };
      // Mostrar el cargador mientras se procesa la solicitud
      setLoading(true);

      // Realizar la solicitud de inicio de sesión al servidor
      const response = await fetch(`${URL}/api/login`, requestOptions);
      const data = await response.json();

      // Ocultar el cargador después de recibir la respuesta del servidor
      setLoading(false);

      // Si la respuesta no es exitosa, mostrar un mensaje de error en este caso por 5 segundos y para la ejecucion
      if (!response.ok) {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
        throw new Error('algo salio mal con el usuario o la contraseña');
      }

      // Establecer el estado de autenticación con los datos del usuario
      setAuth({
        isAuthenticated: true,
        token: data.token,
        user: data.user,
      });

      // Restablecer el estado del formulario y redirigir al usuario a la lista de tareas
      setLoginUser(InicialState);
      navigate('/lista-tareas');
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={estilos.container}>
      {/* Mostrar un cargador si la solicitud está en curso, de lo contrario mostrar el formulario */}
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className={estilos.title}>Inicio Sesion</h1>

          {/* Formulario de inicio de sesión */}
          <form onSubmit={handleSubmit} className={estilos.form}>
            {/* Campo de entrada para el nombre de usuario */}
            <div className={estilos.input_container}>
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                name="username"
                placeholder="Nombre de Usuario"
                onChange={handleChange}
                value={loginUser.username}
              />
              {/* Mostrar mensaje de error si el usuario o la contraseña son incorrectos */}
              {error && <ErrorSpan info="Nombre de Usuario Incorrecto" />}
            </div>

            {/* Campo de entrada para la contraseña */}
            <div className={estilos.input_container}>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                onChange={handleChange}
                value={loginUser.password}
              />
              {/* Mostrar mensaje de error si el usuario o la contraseña son incorrectos */}
              {error && <ErrorSpan info="Contraseña Incorrecta" />}
            </div>

            <button className={estilos.button}>Iniciar Sesion</button>
          </form>
          {/* Enlace para registrarse si el usuario no tiene una cuenta */}
          <p>
            ¿No tienes una cuenta aún?{' '}
            <NavLink className={estilos.link_registro} to="/registrar">
              ¡Regístrate aquí!
            </NavLink>
          </p>
        </>
      )}
    </section>
  );
};

export default Login;
