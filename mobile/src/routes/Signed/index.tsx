import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AllDelivers from '../../pages/AllDelivers';
import TabNav from '../../pages/TabNav';
import NewDeliver from '../../pages/NewDeliver';
import { AuthContext } from '../../context/Auth';
import { RootStackParamList } from './routeTypes';

const Stack = createStackNavigator<RootStackParamList>();

const Signed: React.FC = () => {
  const { type } = useContext(AuthContext);
  return (
    <Stack.Navigator>
      {type === 'store' ? (
        <>
          <Stack.Screen name="AllDelivers" component={AllDelivers} />
          <Stack.Screen name="TabNav" component={TabNav} />
          <Stack.Screen name="NewDeliver" component={NewDeliver} />
        </>
      ) : (
        <Stack.Screen name="TabNav" component={TabNav} />
      )}
    </Stack.Navigator>
  );
};

export default Signed;
