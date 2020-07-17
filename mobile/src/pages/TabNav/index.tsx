import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import TabNavProvider from '../../context/TabNav';
import Instructions from './Instructions';
import Map from './Map';
import { PropsTabNav } from '../../routes/Signed/routeTypes';
import { RootTabNavigation } from './tabTypes';

const Tab = createMaterialTopTabNavigator<RootTabNavigation>();

const TabNav: React.FC<PropsTabNav> = ({ route }) => {
  return (
    <TabNavProvider>
      <Tab.Navigator>
        <Tab.Screen
          name="Map"
          component={Map}
          initialParams={{ ...route.params }}
        />
        <Tab.Screen name="Instructions" component={Instructions} />
      </Tab.Navigator>
    </TabNavProvider>
  );
};

export default TabNav;
