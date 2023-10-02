import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import estilos from './Form.module.css';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface Login {
  username: string;
  password: string;
}

const InicialState = {
  username: '',
  password: '',
};

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState(InicialState);

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

      const response = await fetch(
        'http://localhost:3000/api/login',
        requestOptions
      );
      const dataToken = await response.json();

      console.log(dataToken);

      setAuth({
        isAuthenticated: true,
        token: dataToken.token,
        user: dataToken.user,
      });

      // localStorage.setItem('token', dataToken.token);
      sessionStorage.setItem('token', dataToken.token);
      setLoginUser(InicialState);
      navigate('/lista-tareas');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={estilos.container}>
      <h1 className={estilos.title}>Inicio Sesion</h1>
      <form onSubmit={handleSubmit} className={estilos.form}>
        <div className={estilos.input_container}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            value={loginUser.username}
          />
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
        </div>
        <button className={estilos.button}>Iniciar Sesion</button>
      </form>
      <p>
        Aun no tienes cuenta?{' '}
        <NavLink className={estilos.link_registro} to="/registrar">
          Registrate aqui!
        </NavLink>
      </p>
    </section>
  );
};

export default Login;
