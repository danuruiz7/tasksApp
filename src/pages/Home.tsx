import { NavLink } from 'react-router-dom';
import estilos from './Home.module.css';

const Home = () => {
  return (
    <section className={estilos.container}>
      <h1 className={estilos.title}>App Tareas</h1>
      <div className={estilos.button_container}>
        <NavLink className={estilos.registrar} to="/registrar">
          Registrarse
        </NavLink>
        <NavLink className={estilos.login} to="/login">
          Login
        </NavLink>
      </div>
    </section>
  );
};

export default Home;
