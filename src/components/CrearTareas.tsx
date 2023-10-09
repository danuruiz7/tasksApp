import { useNavigate } from 'react-router';
import { useVariablesGlobal } from '../ContextoGlobal/VariableGlobales';
import estilos from '../pages/Form.module.css';
import { useState } from 'react';
import Loader from './Loader';
import ErrorSpan from './ErrorSpan';
import MensajeSpan from './Mensaje';

// Interfaz para la tarea
interface Tarea {
  id: string;
  title: string;
  description: string;
}

// Estado inicial para una tarea
const inicialState: Tarea = {
  id: '',
  title: '',
  description: '',
};

// Componente para crear o editar tareas
const CrearTareas = () => {
  // Obtiene el estado de autenticación, tarea actual y funciones del contexto de variables globales
  const { auth, tarea, setTarea, update, setUpdate, URL } =
    useVariablesGlobal();

  // Estados para el cargando, errores y mensajes
  const [loading, setLoding] = useState(false);
  const [errorSpan, setErrorSpan] = useState(false);
  const [mensajeSpan, setMensajeSpan] = useState(false);

  // Función de navegación proporcionada por react-router
  const navigate = useNavigate();

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e: any) => {
    setTarea({
      ...tarea,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Muestra el loader mientras se procesa la solicitud
    setLoding(true);

    // Si en la tarea existe la propiedad "id", entonces se editará la tarea
    if (tarea.id) {
      try {
        await fetch(`${URL}/api/tasks/update-task/${tarea.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          },
          body: JSON.stringify(tarea),
        });

        // Oculta el loader y redirige a la lista de tareas
        setLoding(false);

        navigate('/lista-tareas');
        setUpdate(false);
        setTarea(inicialState);
        return;
      } catch (error) {
        // Maneja errores en la consola
        return console.error(error);
      }
    }

    // Si en la tarea NO existe la propiedad "id", entonces se creará una nueva tarea
    try {
      const response = await fetch(`${URL}/api/tasks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        },
        body: JSON.stringify(tarea),
      });

      const data = await response.json();

      // Si la respuesta no es exitosa,oculta el loader y muestra un mensaje de error
      if (!response.ok) {
        setLoding(false);
        setErrorSpan(true);
        setTimeout(() => {
          setErrorSpan(false);
        }, 5000);
        throw new Error('algo salio mal con el usuario o la contraseña');
      }

      // Si la respuesta es exitosa, muestra un mensaje de éxito y oculta el mensaje después de 5 segundos
      setMensajeSpan(true);
      setTimeout(() => {
        setMensajeSpan(false);
      }, 5000);

      // Muestra los datos de la respuesta en la consola, oculta el loader y restablece el formulario
      console.log(data);
      setLoding(false);
      setTarea(inicialState);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={estilos.container}>
      {loading ? (
        // Muestra el componente Loader mientras se está procesando la solicitud
        <Loader />
      ) : (
        <>
          <h2 className={estilos.title}>
            {/* El título cambiará dependiendo de si se está editando o creando una tarea */}
            {update ? 'Editar Tarea' : 'Crear Tarea'}
          </h2>
          <form onSubmit={handleSubmit} className={estilos.form}>
            <div className={estilos.input_container}>
              <label htmlFor="title">Titulo</label>
              <input
                type="text"
                name="title"
                placeholder="Titulo"
                onChange={handleChange}
                value={tarea.title}
              />
              {/* Muestra un mensaje de error si hay un error en el título de la tarea */}
              {errorSpan && <ErrorSpan info="Error en el nombre de la tarea" />}
            </div>

            <div className={estilos.input_container}>
              <label htmlFor="description">Descripcion</label>
              <textarea
                name="description"
                placeholder="Descripcion"
                onChange={handleChange}
                value={tarea.description}
              />
              {/* Muestra un mensaje de error si hay un error en la descripción de la tarea */}
              {errorSpan && (
                <ErrorSpan info="Error en la descripcion de la tarea" />
              )}
            </div>
            <div className={estilos.button_container}>
              {/* Botón para guardar o editar la tarea, dependiendo de si es una tarea nueva o una tarea existente */}
              <button className={update ? estilos.button_edit : estilos.button}>
                {update ? 'Editar Tarea' : 'Nueva Tarea'}
              </button>
            </div>
            {/* Muestra un mensaje de éxito si la tarea se crea correctamente */}
            {mensajeSpan && <MensajeSpan info="Tarea creada con exito" />}
          </form>
        </>
      )}
    </section>
  );
};

export default CrearTareas;
