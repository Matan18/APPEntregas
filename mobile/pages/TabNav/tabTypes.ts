import { RouteProp } from '@react-navigation/native';

export type RootTabNavigation = {
  Map: { deliverKey: string } | undefined;
  Instructions: undefined;
};

type MapRouteProp = RouteProp<RootTabNavigation, 'Map'>;
export type MapScreenProps = {
  route: MapRouteProp;
};
