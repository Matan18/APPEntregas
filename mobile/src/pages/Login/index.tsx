import React, { useState, useContext } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { AuthContext } from '../../context/Auth';
import { api } from '../../services/api';

// import { Container } from './styles';

const Login: React.FC = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const store = {
    name: 'LojaJeste',
    password: 'asdfghjkl',
  };
  const driver = {
    name: 'Driver2',
    password: 'driverpass',
  };
  const navigation = useNavigation();
  const { setType } = useContext(AuthContext);
  function login(data: { name: string; password: string }): void {
    api.post('/login', data).then(response => {
      api.defaults.headers.Authorization = `Baerer ${response.data.token}`;
      if (response.data.store) {
        setType('store');
      } else if (response.data.driver) {
        setType('driver');
      }
      navigation.navigate('Signed');
    });
  }
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={user} onChangeText={setUser} />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title="Store"
        onPress={() => {
          login(store);
        }}
      />
      <Button
        title="Driver"
        onPress={() => {
          login(driver);
        }}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#7519c1',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#fff',
    width: 300,
    padding: 5,
    margin: 5,
    borderRadius: 4,
  },
});
