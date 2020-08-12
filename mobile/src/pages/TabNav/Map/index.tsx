import React, { useState, useEffect, useContext } from 'react';
import { Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {
  getCurrentPositionAsync,
  requestPermissionsAsync,
} from 'expo-location';
import MapDirections, {
  MapDirectionsResponse,
} from 'react-native-maps-directions';
import { ApiKey } from '../../../services/Api.key';
import { api } from '../../../services/api';
import { MapScreenProps } from '../tabTypes';
import { TabNavContext } from '../../../context/TabNav';

// import { Container } from './styles';
interface IDeliverData {
  id: number;
  key: string;
  amount: number;
  packages: {
    id: number;
    product: string;
    latitude: number;
    longitude: number;
  }[];
}

const Map: React.FC<MapScreenProps> = ({ route }) => {
  const [delivers, setDeliver] = useState<IDeliverData>();
  const [center, setCenter] = useState({
    latitude: -25.6438383,
    longitude: -49.2942842,
  });

  const {
    setLegs,
    setCopyrights,
    deliverContext,
    setDeliverContext,
  } = useContext(TabNavContext);

  useEffect(() => {
    async function loadDelivers() {
      if (route.params.key && !route.params.packages) {
        api.get(`/getdeliver/${route.params.key}`).then(response => {
          const { deliver } = response.data;
          setDeliver({ ...deliver });
        });
      }
    }
    loadDelivers();
  }, [route]);

  useEffect(() => {
    async function settingCenter() {
      const centerByDelivers = delivers?.packages.find(
        item => item.product === 'center',
      );
      if (centerByDelivers) {
        delete centerByDelivers?.id;
        delete centerByDelivers?.product;
        setCenter(centerByDelivers);
      } else {
        const { granted } = await requestPermissionsAsync();
        if (granted) {
          const { coords } = await getCurrentPositionAsync({
            enableHighAccuracy: true,
          });
          const centerByExpo = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
          setCenter(centerByExpo);
        }
      }
    }
    settingCenter();
  }, [delivers]);

  useEffect(() => {
    if (route.params.key && route.params.packages) {
      setDeliverContext({
        key: route.params.key,
        packages: [
          ...route.params.packages,
          { id: -1, ...center, product: 'center' },
        ],
      });
    }
  }, [center, route, setDeliverContext]);

  useEffect(() => {
    if (deliverContext?.packages && deliverContext.key && !delivers) {
      setDeliver({
        key: deliverContext.key,
        id: 0,
        amount: deliverContext.packages.length,
        packages: [...deliverContext.packages.map(item => item)],
      });
    }
  }, [deliverContext, delivers]);

  async function navigate(): Promise<void> {
    //const response = await register();
  }

  function handleMapDirectionsResponse(mapResponse: MapDirectionsResponse) {
    setCopyrights(mapResponse.copyrights);
    setLegs(mapResponse.legs);
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
            key={`${item.id}, ${item.latitude}, ${item.longitude}`}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
          />
        ))}
        <Marker coordinate={center} />
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
          onReady={handleMapDirectionsResponse}
          strokeWidth={2}
          optimizeWaypoints={true}
          strokeColor={'#7159c1'}
        />
      </MapView>
      {route.params.packages && (
        <Button
          title="navigate"
          onPress={() => {
            navigate();
          }}
        />
      )}
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
