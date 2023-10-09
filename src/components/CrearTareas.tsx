import { useNavigate } from 'react-router';
import { useAuth } from '../ContextoGlobal/VariableGlobales';
import estilos from '../pages/Form.module.css';
import { useState } from 'react';
import Loader from './Loader';
import ErrorSpan from './ErrorSpan';
import MensajeSpan from './Mensaje';

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
  const { auth, tarea, setTarea, update, setUpdate, URL } = useAuth();
  const [loading, setLoding] = useState(false);
  const [errorSpan, setErrorSpan] = useState(false);
  const [mensajeSpan, setMensajeSpan] = useState(false);

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
    //Editar tarea
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

        setLoding(false);

        navigate('/lista-tareas');
        setUpdate(false);
        setTarea(inicialState);
        return;
      } catch (error) {
        return console.log(error);
      }
    }

    //Crear tarea-----------------------------------------------------------------------------------------
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

      if (!response.ok) {
        setLoding(false);
        setErrorSpan(true);
        setTimeout(() => {
          setErrorSpan(false);
        }, 5000);
        throw new Error('algo salio mal con el usuario o la contraseña');
      }

      setMensajeSpan(true);
      setTimeout(() => {
        setMensajeSpan(false);
      }, 5000);

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
              {errorSpan && (
                <ErrorSpan info="Error en la descripcion de la tarea" />
              )}
            </div>
            <div className={estilos.button_container}>
              <button className={update ? estilos.button_edit : estilos.button}>
                {update ? 'Editar Tarea' : 'Nueva Tarea'}
              </button>
            </div>
            {mensajeSpan && <MensajeSpan info="Tarea creada con exito" />}
          </form>
        </>
      )}
    </section>
  );
};

export default CrearTareas;
