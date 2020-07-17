import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, Button } from 'react-native';
import { PropsNewDeliver } from '../../routes/Signed/routeTypes';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ApiKey } from '../../services/Api.key';
import { FlatList } from 'react-native-gesture-handler';

// import { Container } from './styles';
interface IDeliverPackages {
  id: number;
  product: string;
  latitude: number;
  longitude: number;
}

const NewDeliver: React.FC<PropsNewDeliver> = ({ navigation }) => {
  const [autocompleteFocused, setAutocompleteFocused] = useState(false);
  const [chave, setChave] = useState('');
  const [product, setProduct] = useState('');
  const [packages, setPackages] = useState<IDeliverPackages[]>([]);
  useEffect(() => {
    let list = [];
    for (let i = 0; i < 20; i++) {
      list.push({
        id: i,
        product: 'batata',
        latitude: -25.6438383 - i / 10000,
        longitude: -49.2942842 - i / 10000,
      });
    }
    setPackages(list);
  }, []);

  function navigate() {
    navigation.navigate('TabNav', { key: chave, packages });
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Chave da entrega"
          value={chave}
          onChangeText={e => setChave(e)}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome do produto"
          value={product}
          onChangeText={e => setProduct(e)}
        />
      </View>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details) => {
          if (details?.geometry) {
            setPackages([
              ...packages,
              {
                id: packages.length + 1,
                product: product,
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              },
            ]);
          }
        }}
        query={{
          key: ApiKey,
          language: 'pt-BR',
        }}
        fetchDetails
        textInputProps={{
          onTextInput: () => {
            setAutocompleteFocused(true);
          },
          onBlur: () => {
            setAutocompleteFocused(false);
          },
        }}
        styles={{
          listView: styles.googleListView,
          container: {
            maxHeight: autocompleteFocused ? 190 : 50,
          },
          poweredContainer: styles.googlePoweredcontainer,
        }}
        style={styles.googleContainer}
      />
      <FlatList
        data={packages}
        keyExtractor={(item, index) =>
          `${item.latitude + item.longitude} ${index}`
        }
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text style={styles.itemText}>{item.product}</Text>
          </View>
        )}
        numColumns={2}
      />
      <Button title="Navigate" onPress={() => navigate()} />
    </View>
  );
};

export default NewDeliver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    alignContent: 'space-between',
    width: 390,
  },
  input: {
    flex: 1,
  },
  itemBox: {
    margin: 1,
    borderRadius: 5,
    height: 40,
    borderWidth: 1,
    width: '50%',
  },
  itemText: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#333',
  },
  list: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  googleContainer: {
    height: 'auto',
  },
  googleListView: {
    flex: 1,
  },
  googlePoweredcontainer: {
    flex: 1,
  },
});
