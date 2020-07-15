import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PropsNewDeliver } from '../../routes/Signed/routeTypes';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ApiKey } from '../../services/Api.key';

// import { Container } from './styles';

const NewDeliver: React.FC<PropsNewDeliver> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details) => {}}
        query={{
          key: ApiKey,
          language: 'pt-BR',
        }}
        textInputProps={{}}
      />
    </View>
  );
};

export default NewDeliver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
