import { NavLink } from 'react-router-dom';
import estilos from './Home.module.css';

const Home = () => {
  return (
    <section className={estilos.container}>
      <h1 className={estilos.title}>Tasks APP</h1>
      <p className={estilos.description}>
        TasksAPP es una aplicación web que te ayuda a gestionar tus tareas
        pendientes de forma eficiente. Con TasksAPP, puedes organizar y recordar
        las tareas que necesitas completar, asegurándote de que nada se te pase
        por alto. ¡Simplifica tu vida y aumenta tu productividad con TasksAPP!
      </p>
      <div className={estilos.button_container}>
        <NavLink className={estilos.registrar} to="/registrar">
          Registrarse
        </NavLink>
        <NavLink className={estilos.login} to="/login">
          Iniciar sesión
        </NavLink>
      </div>
    </section>
  );
};

export default Home;
