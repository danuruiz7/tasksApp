import { useState } from 'react';
import estilos from './Form.module.css';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';

interface newUser {
  username: string;
  password1: string;
  password2: string;
}

const inicialState: newUser = {
  username: '',
  password1: '',
  password2: '',
};

const Registrar = () => {
  const [newUser, setNewUser] = useState(inicialState);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      };

      const response = await fetch(
        'http://localhost:3000/api/register',
        requestOptions
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.msg);
        throw new Error('Error al registrar el usuario');
      }

      console.log('Usuario registrado con exito ', data);
      setNewUser(inicialState);
      alert(data.msg);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className={estilos.container}>
      <h1 className={estilos.title}>Registrar Usuario</h1>
      <form onSubmit={handleSubmit} className={estilos.form}>
        <div className={estilos.input_container}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            value={newUser.username}
          />
        </div>
        <div className={estilos.input_container}>
          <label htmlFor="password1">Contraseña</label>
          <input
            type="password"
            name="password1"
            placeholder="Contraseña"
            onChange={handleChange}
            value={newUser.password1}
          />
        </div>
        <div className={estilos.input_container}>
          <label htmlFor="password2">Confirma contraseña</label>
          <input
            type="password"
            name="password2"
            placeholder="Confirma contraseña"
            onChange={handleChange}
            value={newUser.password2}
          />
        </div>
        <button className={estilos.button}>Registrarse</button>
      </form>
      <p>
        Ya tienes cuenta?{' '}
        <NavLink className={estilos.link_registro} to="/login">
          {''}Inicia sesion aqui!
        </NavLink>
      </p>
    </section>
  );
};

export default Registrar;
