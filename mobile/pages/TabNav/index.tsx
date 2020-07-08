import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Instructions from './Instructions';
import Map from './Map';

const Tab = createMaterialTopTabNavigator();

const TabNav: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Instructions" component={Instructions} />
    </Tab.Navigator>
  );
};

export default TabNav;
