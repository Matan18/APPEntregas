import React, { createContext, useState } from 'react';
import { MapDirectionsLegs } from 'react-native-maps-directions';

// import { Container } from './styles';
interface TabNavContextData {
  legs: MapDirectionsLegs;
  setLegs(legs: MapDirectionsLegs): void;
  copyrights: string;
  setCopyrights(value: string): void;
}

export const TabNavContext = createContext({} as TabNavContextData);

const TabNavProvider: React.FC = ({ children }) => {
  const [legs, setLegs] = useState({} as MapDirectionsLegs);
  const [copyrights, setCopyrights] = useState('');
  return (
    <TabNavContext.Provider
      value={{ setLegs, legs, copyrights, setCopyrights }}
    >
      {children}
    </TabNavContext.Provider>
  );
};

export default TabNavProvider;
