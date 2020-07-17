import React, { createContext, useState } from 'react';
import { IDeliver } from '../../routes/Signed/routeTypes';

interface DeliverContextData {
  deliver: IDeliver;
  setDeliver(value: IDeliver): void;
  clear(): void;
}
export const DeliverContext = createContext({} as DeliverContextData);

const DeliverContextProvider: React.FC = ({ children }) => {
  const [deliver, setDeliver] = useState({} as IDeliver);
  function clear() {
    setDeliver({} as IDeliver);
  }
  return (
    <DeliverContext.Provider value={{ deliver, setDeliver, clear }}>
      {children}
    </DeliverContext.Provider>
  );
};

export default DeliverContextProvider;
