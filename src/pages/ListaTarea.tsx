import { useNavigate } from 'react-router';
import { useAuth } from '../ContextoGlobal/VariableGlobales';
import estilos from './ListaTarea.module.css';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { NavLink } from 'react-router-dom';

interface Tareas {
  id: number;
  title: string;
  description: string;
  create_at: string;
  user_id: number;
}

const ListaTarea = () => {
  const [tareas, setTareas] = useState<Tareas[]>([]);
  const { auth, setAuth, setTarea, setUpdate, URL } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTareas() {
      setLoading(true);
      try {
        const response = await fetch(`${URL}/api/tasks/list`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + auth.token,
          },
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          navigate('/login');
          setAuth({
            isAuthenticated: false,
            token: '',
            user: '',
          });
          throw new Error('No se pudo obtener la lista de tareas');
        }

        for (const tarea of data) {
          const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long', // 'short' para nombres de mes abreviados
            year: 'numeric',
          };

          tarea.create_at = new Date(tarea.create_at).toLocaleDateString(
            'es-ES',
            options
          );
        }

        setTareas(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTareas();
    // console.log('useEffect');
  }, []);

  const handleEdit = (tarea: any) => {
    setTarea(tarea);
    setUpdate(true);
    navigate('/crear-tarea');
  };

  const handleDelete = (id: number) => {
    setLoading(true);
    const deleteTask = async () => {
      try {
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

        if (!deleteResponse.ok) {
          throw new Error('No se pudo eliminar la tarea');
        }

        setTareas(tareas.filter((tarea: any) => tarea.id !== id));
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    deleteTask();
    console.log('handleDelete');
  };
  console.log('tareas:  ', tareas[0]);
  return (
    <section className={estilos.container}>
      <h1 className={estilos.title}>Tareas de {auth.user}</h1>
      {loading ? (
        <Loader />
      ) : tareas && tareas.length > 0 ? (
        <ul className={estilos.task_list}>
          {tareas?.map((tarea) => (
            <li key={tarea.id} className={estilos.task_item}>
              <header className={estilos.task_header}>
                <h2 className={estilos.task_title}>{tarea.title}</h2>
                <p className={estilos.task_user}>
                  {' '}
                  Hecho por{' '}
                  <span className={estilos.user_name}>{auth.user}</span>{' '}
                </p>
              </header>
              <section className={estilos.task_details}>
                <p className={estilos.task_description}>{tarea.description}</p>
              </section>
              <footer className={estilos.task_footer}>
                <p className={estilos.task_created_at}>
                  Creado un: {tarea.create_at}
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
        <NavLink to="/crear-tarea">
          <h2 className={estilos.no_tasks}>
            No hay tareas, CLICK AQUI PARA CREARLA
          </h2>
        </NavLink>
      )}
    </section>
  );
};

export default ListaTarea;
