import estilos from './Mensaje.module.css';

interface Props {
  info: string;
}

const Mensaje = ({ info }: Props) => {
  return <span className={estilos.mensaje}>{info}</span>;
};

export default Mensaje;
