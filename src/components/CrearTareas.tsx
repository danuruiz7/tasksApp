import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import estilos from '../pages/Form.module.css';
import { useState } from 'react';
import Loader from './Loader';
import ErrorSpan from './ErrorSpan';

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
  const [loading, setLoding] = useState(false);
  const [errorspan, setErrorSpan] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setTarea({
      ...tarea,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(e);
    setLoding(true);
    //Editar tarea------------------------------------------------------------------------------------
    if (tarea.id) {
      const response = await fetch(
        `https://tasksappapi-production.up.railway.app/api/tasks/update-task/${tarea.id}`,
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
      setLoding(false);

      navigate('/lista-tareas');
      setUpdate(false);
      setTarea(inicialState);
      return;
    }

    //Crear tarea-----------------------------------------------------------------------------------------
    try {
      const response = await fetch(
        'https://tasksappapi-production.up.railway.app/api/tasks/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          },
          body: JSON.stringify(tarea),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setLoding(false);
        setErrorSpan(true);
        setTimeout(() => {
          setErrorSpan(false);
        }, 5000);
        throw new Error('algo salio mal con el usuario o la contraseña');
      }

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
        <Loader />
      ) : (
        <>
          <h2 className={estilos.title}>
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
              {errorspan && <ErrorSpan info="Error en el nombre de la tarea" />}
            </div>

            <div className={estilos.input_container}>
              <label htmlFor="description">Descripcion</label>
              <textarea
                name="description"
                placeholder="Descripcion"
                onChange={handleChange}
                value={tarea.description}
              />
              {errorspan && (
                <ErrorSpan info="Error en la descripcion de la tarea" />
              )}
            </div>
            <div className={estilos.button_container}>
              <button className={update ? estilos.button_edit : estilos.button}>
                {update ? 'Editar Tarea' : 'Nueva Tarea'}
              </button>
              {!update && (
                <button id="hola" className={estilos.button}>
                  Crear e ir a lista
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </section>
  );
};

export default CrearTareas;
