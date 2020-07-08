import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AllDelivers from '../../pages/AllDelivers';
import TabNav from '../../pages/TabNav';
import { AuthContext } from '../../context/Auth';

const Stack = createStackNavigator();

const Signed: React.FC = () => {
  const { type } = useContext(AuthContext);
  return (
    <Stack.Navigator>
      {type.value === 'store' ? (
        <>
          <Stack.Screen name="AllDelivers" component={AllDelivers} />
          <Stack.Screen name="TabNav" component={TabNav} />
        </>
      ) : (
        <Stack.Screen name="TabNav" component={TabNav} />
      )}
    </Stack.Navigator>
  );
};

export default Signed;
