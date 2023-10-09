import { useNavigate } from 'react-router';
import { useAuth } from '../ContextoGlobal/VariableGlobales';
import estilos from './Form.module.css';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ErrorSpan from '../components/ErrorSpan';
import Loader from '../components/Loader';

interface Login {
  username: string;
  password: string;
}

const InicialState = {
  username: '',
  password: '',
};

const Login = () => {
  const { setAuth, URL } = useAuth();
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState(InicialState);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setLoginUser({
      ...loginUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginUser),
      };
      setLoading(true);
      const response = await fetch(`${URL}/api/login`, requestOptions);
      const data = await response.json();

      setLoading(false);
      if (!response.ok) {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
        throw new Error('algo salio mal con el usuario o la contraseña');
      }

      setAuth({
        isAuthenticated: true,
        token: data.token,
        user: data.user,
      });

      setLoginUser(InicialState);
      navigate('/lista-tareas');
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={estilos.container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className={estilos.title}>Inicio Sesion</h1>
          <form onSubmit={handleSubmit} className={estilos.form}>
            <div className={estilos.input_container}>
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                value={loginUser.username}
              />
              {error && <ErrorSpan info="Username Incorreto" />}
            </div>
            <div className={estilos.input_container}>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                onChange={handleChange}
                value={loginUser.password}
              />
              {error && <ErrorSpan info="Contraseña incorrecta" />}
            </div>
            <button className={estilos.button}>Iniciar Sesion</button>
          </form>
          <p>
            Aun no tienes cuenta?{' '}
            <NavLink className={estilos.link_registro} to="/registrar">
              Registrate aqui!
            </NavLink>
          </p>
        </>
      )}
    </section>
  );
};

export default Login;
