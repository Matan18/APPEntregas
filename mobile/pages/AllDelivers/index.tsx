import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// import { Container } from './styles';

const AllDelivers: React.FC = () => {
  const navigation = useNavigation();
  function navigate(): void {
    navigation.navigate('TabNav');
  }
  return (
    <View style={styles.container}>
      <Button
        title="navigate"
        onPress={() => {
          navigate();
        }}
      />
    </View>
  );
};

export default AllDelivers;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
});
