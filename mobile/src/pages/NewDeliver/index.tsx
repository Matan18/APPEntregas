/* eslint-disable prettier/prettier */
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
    setPackages([
      { latitude: -25.642031, longitude: -49.302177, product: 'batata1', id: 0 },
      { latitude: -25.645205, longitude: -49.296897, product: 'batata2', id: 1 },
      { latitude: -25.646559, longitude: -49.302433, product: 'batata3', id: 2 },
      { latitude: -25.645901, longitude: -49.308591, product: 'batata4', id: 3 },
      { latitude: -25.653138, longitude: -49.315841, product: 'batata5', id: 4 },
      { latitude: -25.653999, longitude: -49.321613, product: 'batata6', id: 5 },
      { latitude: -25.657419, longitude: -49.330593, product: 'batata7', id: 6 },
      { latitude: -25.662103, longitude: -49.336247, product: 'batata8', id: 7 },
      { latitude: -25.669081, longitude: -49.328060, product: 'batata9', id: 8 },
      { latitude: -25.666126, longitude: -49.325341, product: 'batata10', id: 9 },
      { latitude: -25.664369, longitude: -49.311792, product: 'batata11', id: 9 },
      { latitude: -25.663522, longitude: -49.305110, product: 'batata12', id: 10 },
      { latitude: -25.669786, longitude: -49.303811, product: 'batata13', id: 11 },
      { latitude: -25.659303, longitude: -49.294546, product: 'batata14', id: 12 },
      { latitude: -25.649779, longitude: -49.291598, product: 'batata15', id: 13 },
      { latitude: -25.641232, longitude: -49.274631, product: 'batata16', id: 14 },
      { latitude: -25.637850, longitude: -49.295455, product: 'batata17', id: 15 },
      { latitude: -25.641409, longitude: -49.293116, product: 'batata18', id: 16 },
      { latitude: -25.640351, longitude: -49.288347, product: 'batata19', id: 17 },
      { latitude: -25.645274, longitude: -49.288197, product: 'batata20', id: 18 },
      { latitude: -25.634170, longitude: -49.295666, product: 'batata21', id: 19 },
    ]);
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
