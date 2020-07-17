import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { api } from '../../services/api';
import { PropsAllDelivers } from '../../routes/Signed/routeTypes';

// import { Container } from './styles';
interface deliverData {
  id: number;
  key: string;
  amount: number;
}

const AllDelivers: React.FC<PropsAllDelivers> = ({ navigation }) => {
  const [delivers, setDelivers] = useState<deliverData[] | null>();
  useEffect(() => {
    api.get('/alldelivers').then(response => {
      setDelivers(response.data.delivers);
    });
  }, []);
  function navigate(): void {
    navigation.navigate('NewDeliver');
  }
  function navigateToDetail(key: string) {
    navigation.navigate('TabNav', { key });
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={delivers}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item }) => (
          <View style={styles.deliverView} key={item.id}>
            <View>
              <Text>{item.key}</Text>
              <Text>{item.amount} Items</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigateToDetail(item.key)}
              style={styles.buttonView}
            />
          </View>
        )}
      />
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
  deliverView: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-around',
    borderWidth: 2,
    borderRadius: 10,
    margin: 10,
  },
  buttonView: { width: 50, height: 50, borderRadius: 8, borderWidth: 1 },
});
