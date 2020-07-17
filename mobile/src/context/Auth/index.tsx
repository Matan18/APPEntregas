import React, { createContext, useState } from 'react';

type contextType = 'store' | 'driver' | null;

interface AuthContextData {
  signed: boolean;
  type: contextType;
  setType(value: contextType): void;
  signIn(value: boolean): void;
}

export const AuthContext = createContext({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [signed, setSigned] = useState(Boolean);
  const [type, setType] = useState({} as contextType);
  return (
    <AuthContext.Provider value={{ signed, signIn: setSigned, type, setType }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
