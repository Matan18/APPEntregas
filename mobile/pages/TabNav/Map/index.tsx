import React, { useState, useEffect, useContext } from 'react';
import { Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import MapDirections from 'react-native-maps-directions';
import { ApiKey } from '../../../services/Api.key';
import { api } from '../../../services/api';
import { MapScreenProps } from '../tabTypes';
import { TabNavContext } from '../../../context/TabNav';

// import { Container } from './styles';
interface DeliverData {
  id: number;
  key: string;
  amount: number;
  packages: [
    {
      id: number;
      product: string;
      latitude: number;
      longitude: number;
    },
  ];
}

const Map: React.FC<MapScreenProps> = ({ route }) => {
  const [delivers, setDeliver] = useState<DeliverData>();
  const [center, setCenter] = useState({
    latitude: -25.6438383,
    longitude: -49.2942842,
  });

  const { setLegs, setCopyrights } = useContext(TabNavContext);

  useEffect(() => {
    if (delivers?.packages.filter(item => item.product === 'center')[0]) {
      const newCenter = {
        latitude: delivers.packages.filter(item => item.product === 'center')[0]
          .latitude,
        longitude: delivers.packages.filter(
          item => item.product === 'center',
        )[0].longitude,
      };
      setCenter(newCenter);
    }
  }, [delivers]);
  useEffect(() => {
    api.get(`/getdeliver/${route.params?.deliverKey}`).then(response => {
      const { deliver, packages } = response.data;
      setDeliver({ ...deliver, packages });
    });
  }, [route]);

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
        {delivers?.packages.map(item => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
          />
        ))}
        <MapDirections
          origin={center}
          waypoints={delivers?.packages.map(item => ({
            latitude: item.latitude,
            longitude: item.longitude,
          }))}
          language="pt-br"
          destination={center}
          apikey={ApiKey}
          onError={e => console.log('error ', e)}
          onReady={e => {
            setLegs(e.legs);
            setCopyrights(e.copyrights);
          }}
          strokeWidth={2}
          optimizeWaypoints={true}
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
