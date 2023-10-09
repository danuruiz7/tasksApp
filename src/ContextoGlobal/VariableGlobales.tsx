import { useContext, createContext, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

export interface Tarea {
  id: any;
  title: string;
  description: string;
}

interface AuthProps {
  isAuthenticated: boolean;
  token: string;
  user: string;
}

const inicialState: Tarea = {
  id: '',
  title: '',
  description: '',
};

const authInicial: AuthProps = {
  isAuthenticated: false,
  token: '',
  user: '',
};

const AuthContext = createContext({
  auth: {} as AuthProps,
  setAuth: (_authInicial: AuthProps) => {},
  tarea: {} as Tarea,
  setTarea: (_inicialState: Tarea) => {},
  update: false,
  setUpdate: (_update: boolean) => {},
  URL: '',
});

export function AuthProvider({ children }: Props) {
  const [auth, setAuth] = useState(authInicial);
  const [tarea, setTarea] = useState(inicialState);
  const [update, setUpdate] = useState(false);
  const URL = 'https://tasksappapi-production.up.railway.app';

  return (
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
