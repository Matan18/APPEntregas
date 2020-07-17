import React, { createContext, useState } from 'react';
import { MapDirectionsLegs } from 'react-native-maps-directions';
import { IDeliver } from '../../routes/Signed/routeTypes';
import { api } from '../../services/api';

// import { Container } from './styles';
interface TabNavContextData {
  legs: MapDirectionsLegs;
  setLegs(legs: MapDirectionsLegs): void;
  copyrights: string;
  setCopyrights(value: string): void;
  deliverContext: IDeliver;
  setDeliverContext(value: IDeliver): void;
  register(): Promise<void>;
}

export const TabNavContext = createContext({} as TabNavContextData);

const TabNavProvider: React.FC = ({ children }) => {
  const [legs, setLegs] = useState({} as MapDirectionsLegs);
  const [deliverContext, setDeliverContext] = useState({} as IDeliver);
  const [copyrights, setCopyrights] = useState('');

  async function register() {
    await api.post('/newdeliver', deliverContext);
  }

  return (
    <TabNavContext.Provider
      value={{
        setLegs,
        legs,
        copyrights,
        setCopyrights,
        deliverContext,
        setDeliverContext,
        register,
      }}
    >
      {children}
    </TabNavContext.Provider>
  );
};

export default TabNavProvider;
