import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import estilos from './ListaTarea.module.css';
import { useEffect, useState } from 'react';

const ListaTarea = () => {
  const [tareas, setTareas] = useState();
  const { auth, setAuth, setTarea, setUpdate } = useAuth();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  console.log(token);

  useEffect(() => {
    async function fetchTareas() {
      try {
        const response = await fetch('http://localhost:3000/api/tasks/list', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + auth.token,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          alert(data.msg);
          navigate('/login');
          setAuth({
            isAuthenticated: false,
            token: '',
            user: '',
          });
          throw new Error('No se pudo obtener la lista de tareas');
        }
        setTareas(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTareas();
    console.log('useEffect');
  }, []);

  const handleEdit = (tarea: any) => {
    setTarea(tarea);
    setUpdate(true);
    navigate('/crear-tarea');
  };

  const handleDelete = (id: number) => {
    console.log(id);

    const deleteTask = async () => {
      try {
        const deleteResponse = await fetch(
          `http://localhost:3000/api/tasks/delete-task/${id}`,
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
      } catch (error) {
        console.error(error);
      }
    };

    deleteTask();
    console.log('handleDelete');
  };
  return (
    <section className={estilos.container}>
      <ul className={estilos.task_list}>
        {tareas?.map((tarea) => (
          <li key={tarea.id} className={estilos.task_item}>
            <header className={estilos.task_header}>
              <h2 className={estilos.task_title}>{tarea.title}</h2>
              <span className={estilos.task_user}>{auth.user}</span>
            </header>
            <section className={estilos.task_details}>
              <p className={estilos.task_description}>{tarea.description}</p>
              <span className={estilos.task_created_at}>{tarea.create_at}</span>
            </section>
            <footer className={estilos.task_footer}>
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
            </footer>
          </li>
        ))}
      </ul>

      {/* <ul>
        {tareas?.map((tarea) => (
          <li key={tarea.id}>
            <header>
              <h2>{tarea.title}</h2>
              <span>{tarea.user_id}</span>
            </header>
            <section>
              <p>{tarea.description}</p>
              <span>{tarea.create_at}</span>
            </section>
            <footer>
              <button onClick={() => handleDelete(tarea.id)}>Eliminar</button>
              <button onClick={() => handleEdit(tarea)}>Editar</button>
            </footer>
          </li>
        ))}
      </ul> */}
    </section>
  );
};

export default ListaTarea;
