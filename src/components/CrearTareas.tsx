import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import estilos from '../pages/Form.module.css';

interface Tarea {
  id: any;
  title: string;
  description: string;
}

const inicialState: Tarea = {
  id: '',
  title: '',
  description: '',
};

const CrearTareas = () => {
  const { auth, tarea, setTarea, update, setUpdate } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setTarea({
      ...tarea,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (tarea.id) {
      const editarTarea = async () => {
        const response = await fetch(
          `http://localhost:3000/api/tasks/update-task/${tarea.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + auth.token,
            },
            body: JSON.stringify(tarea),
          }
        );

        const data = await response.json();
        console.log(data);
      };

      editarTarea();
      navigate('/lista-tareas');
      setUpdate(false);
      setTarea(inicialState);
      return;
    }
    const enviarTarea = async () => {
      const response = await fetch('http://localhost:3000/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        },
        body: JSON.stringify(tarea),
      });

      const data = await response.json();

      console.log(data);
    };

    enviarTarea();

    setTarea(inicialState);
  };

  return (
    <section className={estilos.container}>
      <h2 className={estilos.title}>
        {update ? 'Editar Tarea' : 'Crear Tarea'}
      </h2>
      <form onSubmit={handleSubmit} className={estilos.form}>
        <div className={estilos.input_container}>
          <label htmlFor="title">Titulo</label>
          <input
            type="text"
            name="title"
            placeholder="Username"
            onChange={handleChange}
            value={tarea.title}
          />
        </div>

        <div className={estilos.input_container}>
          <label htmlFor="description">Descripcion</label>
          <textarea
            name="description"
            placeholder="Descripcion de la tareas"
            onChange={handleChange}
            value={tarea.description}
          />
        </div>

        <button className={update ? estilos.button_edit : estilos.button}>
          {update ? 'Editar Tarea' : 'Crear Tarea'}
        </button>
      </form>
    </section>
  );
};

export default CrearTareas;
