import React, { useState, useContext } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { AuthContext } from '../../context/Auth';

// import { Container } from './styles';

const Login: React.FC = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { setType } = useContext(AuthContext);
  function navigate(): void {
    navigation.navigate('Signed');
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
          setType({ value: 'store' });
          navigate();
        }}
      />
      <Button
        title="Driver"
        onPress={() => {
          setType({ value: 'driver' });
          navigate();
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
