import { useState } from 'react';
import estilos from './Form.module.css';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import ErrorSpan from '../components/ErrorSpan';
import Loader from '../components/Loader';
import { useAuth } from '../ContextoGlobal/VariableGlobales';

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
  const { URL } = useAuth();
  const [newUser, setNewUser] = useState(inicialState);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    newUser.username = newUser.username.trim().replace(/\s/g, ''); //trim elimina los espacios en blanco al principio y al final de la cadena
    newUser.password1 = newUser.password1.trim().replace(/\s/g, ''); //Esto elimina todos los espacios en blanco.
    newUser.password2 = newUser.password2.trim().replace(/\s/g, '');

    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      };
      setLoading(true);
      const response = await fetch(`${URL}/api/register`, requestOptions);
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        console.log(data.msg);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
        return data;
      }

      console.log('Usuario registrado con exito ', data);
      setNewUser(inicialState);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className={estilos.container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className={estilos.title}>Registrarte</h1>
          <form onSubmit={handleSubmit} className={estilos.form}>
            <div className={estilos.input_container}>
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                name="username"
                placeholder="Usuario"
                onChange={handleChange}
                value={newUser.username}
              />
              {error ? (
                <ErrorSpan info="Username no valido" />
              ) : (
                <ul className={estilos.ul_info}>
                  <li>- No puede contener espacios</li>
                  <li>- Distinge mayusculas y minusculas</li>
                  <li>- Debe contener al menos 3 caracteres</li>
                </ul>
              )}
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
              {error ? (
                <ErrorSpan info="Password no valido" />
              ) : (
                <ul className={estilos.ul_info}>
                  <li>- No puede contener espacios</li>
                  <li>- Distinge mayusculas y minusculas</li>
                  <li>- Debe contener al menos 3 caracteres</li>
                </ul>
              )}
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
              {error && <ErrorSpan info="Password no valido" />}
            </div>
            <button className={estilos.button}>Registrarse</button>
          </form>
          <p>
            Ya tienes cuenta?{' '}
            <NavLink className={estilos.link_registro} to="/login">
              {''}Inicia sesion aqui!
            </NavLink>
          </p>
        </>
      )}
    </section>
  );
};

export default Registrar;
