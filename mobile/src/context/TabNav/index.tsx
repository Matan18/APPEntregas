import React, { createContext, useState } from 'react';
import { MapDirectionsLegs } from 'react-native-maps-directions';
import { IDeliver } from '../../routes/Signed/routeTypes';
import { api } from '../../services/api';

// import { Container } from './styles';
type IDeliverContext = IDeliver | null;

interface TabNavContextData {
  legs: MapDirectionsLegs;
  setLegs(legs: MapDirectionsLegs): void;
  copyrights: string;
  setCopyrights(value: string): void;
  deliverContext: IDeliver | null;
  setDeliverContext(value: IDeliver | null): void;
  register(): Promise<boolean>;
}

export const TabNavContext = createContext({} as TabNavContextData);

const TabNavProvider: React.FC = ({ children }) => {
  const [legs, setLegs] = useState({} as MapDirectionsLegs);
  const [deliverContext, setDeliverContext] = useState<IDeliverContext>(null);
  const [copyrights, setCopyrights] = useState('');

  async function register(): Promise<boolean> {
    const response = await api.post('/newdeliver', deliverContext);
    return response.status === 201 ? true : false;
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
