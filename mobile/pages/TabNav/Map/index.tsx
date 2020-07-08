import React from 'react';
import { Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import MapDirections from 'react-native-maps-directions';
import { ApiKey } from '../../../services/Api.key';

// import { Container } from './styles';

const Map: React.FC = () => {
  const center = {
    latitude: -25.6438383,
    longitude: -49.2942842,
  };
  const destination = {
    latitude: -25.638381,
    longitude: -49.302809,
  };

  const navigation = useNavigation();
  function navigate(): void {
    navigation.goBack();
  }
  return (
    <>
      <MapView
        key={ApiKey}
        style={styles.map}
        region={{
          ...center,
          latitudeDelta: 0.018,
          longitudeDelta: 0.018,
        }}
      >
        <Marker coordinate={center} />
        <Marker coordinate={destination} />
        <MapDirections
          origin={center}
          destination={destination}
          apikey={ApiKey}
          onReady={e => console.log(e.legs)}
          strokeWidth={2}
          strokeColor={'#7159c1'}
        />
      </MapView>
      <Button
        title="navigate"
        onPress={() => {
          navigate();
        }}
      />
    </>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    backgroundColor: '#453030',
    flex: 1,
  },
});
