import { useNavigate } from 'react-router';
import { useVariablesGlobal } from '../ContextoGlobal/VariableGlobales';
import estilos from './ListaTarea.module.css';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { NavLink } from 'react-router-dom';

// Interfaz para el objeto de tarea
interface Tareas {
  id: number;
  title: string;
  description: string;
  create_at: string;
  user_id: number;
}

// Componente funcional para la lista de tareas
const ListaTarea = () => {
  // Estados para las tareas, estado de carga y función de navegación
  const [tareas, setTareas] = useState<Tareas[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth, setAuth, setTarea, setUpdate, URL } = useVariablesGlobal();

  // Efecto de carga inicial para obtener las tareas del servidor
  useEffect(() => {
    async function fetchTareas() {
      setLoading(true);
      try {
        // Realizar solicitud para obtener la lista de tareas desde el servidor
        const response = await fetch(`${URL}/api/tasks/list`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + auth.token,
          },
        });

        // Parsear la respuesta
        const data = await response.json();

        // Si la respuesta no es exitosa, no autenticamos al usuario y se redirige al inicio de sesión.
        if (!response.ok) {
          setAuth({
            isAuthenticated: false,
            token: '',
            user: '',
          });
          navigate('/login');
          throw new Error('No se pudo obtener la lista de tareas');
        }

        // Formatear las fechas en las tareas
        for (const tarea of data) {
          const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          };

          tarea.create_at = new Date(tarea.create_at).toLocaleDateString(
            'es-ES',
            options
          );
        }

        // Actualizar el estado de las tareas y ocultar el cargador
        setTareas(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTareas();
  }, []);

  // Función para manejar la edición de una tarea
  const handleEdit = (tarea: any) => {
    setTarea(tarea);
    //Cambia la variable 'update' a 'true' para indicar que se está editando una tarea.
    setUpdate(true);
    navigate('/crear-tarea');
  };

  // Función para manejar la eliminación de una tarea
  const handleDelete = (id: number) => {
    setLoading(true);
    const deleteTask = async () => {
      try {
        // Realizar solicitud para eliminar la tarea del servidor
        const deleteResponse = await fetch(
          `${URL}/api/tasks/delete-task/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + auth.token,
            },
          }
        );

        // Si la respuesta no es exitosa, lanzar una excepción
        if (!deleteResponse.ok) {
          throw new Error('No se pudo eliminar la tarea');
        }
        // Si la respuesta es exitosa, eliminar la tarea de la lista
        setTareas(tareas.filter((tarea: any) => tarea.id !== id));
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    // Llamar a la función para eliminar la tarea
    deleteTask();
  };

  return (
    <section className={estilos.container}>
      {/* Título de la lista de tareas con el nombre de usuario autenticado */}
      <h1 className={estilos.title}>Tareas de {auth.user}</h1>

      {/* Mostrar un cargador mientras se cargan las tareas */}
      {loading ? (
        <Loader />
      ) : tareas && tareas.length > 0 ? ( // Si hay tareas, mostrar la lista de tareas
        <ul className={estilos.task_list}>
          {tareas.map((tarea) => (
            <li key={tarea.id} className={estilos.task_item}>
              {/* Encabezado de la tarea con título y usuario */}
              <header className={estilos.task_header}>
                <h2 className={estilos.task_title}>{tarea.title}</h2>
                <p className={estilos.task_user}>
                  Hecho por{' '}
                  <span className={estilos.user_name}>{auth.user}</span>
                </p>
              </header>

              {/* Detalles de la tarea con descripción */}
              <section className={estilos.task_details}>
                <p className={estilos.task_description}>{tarea.description}</p>
              </section>

              {/* Pie de la tarea con fecha de creación y botones de editar y eliminar */}
              <footer className={estilos.task_footer}>
                <p className={estilos.task_created_at}>
                  Creado el: {tarea.create_at}
                </p>
                <div className={estilos.container_button}>
                  <button
                    className={estilos.delete_button}
                    onClick={() => handleDelete(tarea.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className={estilos.edit_button}
                    onClick={() => handleEdit(tarea)}
                  >
                    Editar
                  </button>
                </div>
              </footer>
            </li>
          ))}
        </ul>
      ) : (
        // Si no hay tareas, mostrar un mensaje y un enlace para crear una nueva tarea
        <NavLink to="/crear-tarea">
          <h2 className={estilos.no_tasks}>
            No hay tareas, ¡Haz clic aquí para crear una!
          </h2>
        </NavLink>
      )}
    </section>
  );
};

export default ListaTarea;
