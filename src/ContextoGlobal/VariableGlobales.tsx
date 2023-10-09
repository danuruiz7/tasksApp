import { useContext, createContext, useState } from 'react';

// Interfaz para las propiedades del componente VariablesProvider
interface Props {
  children: React.ReactNode;
}

// Interfaz para el objeto de tarea
export interface Tarea {
  id: any;
  title: string;
  description: string;
}

// Interfaz para las propiedades de autenticación
interface AuthProps {
  isAuthenticated: boolean;
  token: string;
  user: string;
}

// Estado inicial para una tarea
const inicialState: Tarea = {
  id: '',
  title: '',
  description: '',
};

// Estado inicial para la autenticación
const authInicial: AuthProps = {
  isAuthenticated: false,
  token: '',
  user: '',
};

// Creación del contexto de variables globales
const VariablesGlobales = createContext({
  auth: {} as AuthProps,
  setAuth: (_authInicial: AuthProps) => {},
  tarea: {} as Tarea,
  setTarea: (_inicialState: Tarea) => {},
  update: false,
  setUpdate: (_update: boolean) => {},
  URL: '',
});

// Componente proveedor para el contexto de variables globales
export function VariablesProvider({ children }: Props) {
  // Estados para autenticación, tarea y estado para saber si se está creando o actualizando una tarea, además de la URL base.
  const [auth, setAuth] = useState(authInicial);
  const [tarea, setTarea] = useState(inicialState);
  const [update, setUpdate] = useState(false);
  const URL = 'https://tasksappapi-production.up.railway.app';

  return (
    // Proveedor de contexto que proporciona los estados y funciones a los componentes hijos
    <VariablesGlobales.Provider
      value={{
        auth,
        setAuth,
        tarea,
        setTarea,
        update,
        setUpdate,
        URL,
      }}
    >
      {children}
    </VariablesGlobales.Provider>
  );
}

// Hook personalizado para acceder al contexto de variables globales en los componentes hijos
export const useVariablesGlobal = () => useContext(VariablesGlobales);
