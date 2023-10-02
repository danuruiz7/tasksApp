import estilos from './ErrorSpan.module.css';

interface Props {
  info: string;
}

const ErrorSpan = ({ info }: Props) => {
  return <span className={estilos.error}>{info}</span>;
};

export default ErrorSpan;
