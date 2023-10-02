import { useContext, createContext, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

interface Tarea {
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
  setAuth: (value: AuthProps) => {},
  tarea: {} as Tarea,
  setTarea: (value: Tarea) => {},
  update: false,
  setUpdate: (value: boolean) => {},
});

export function AuthProvider({ children }: Props) {
  const [auth, setAuth] = useState(authInicial);
  const [tarea, setTarea] = useState(inicialState);
  const [update, setUpdate] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        tarea,
        setTarea,
        update,
        setUpdate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
