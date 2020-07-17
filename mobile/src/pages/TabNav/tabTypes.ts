import { RouteProp } from '@react-navigation/native';
import { IDeliver } from '../../routes/Signed/routeTypes';

export type RootTabNavigation = {
  Map: IDeliver;
  Instructions: undefined;
};

type MapRouteProp = RouteProp<RootTabNavigation, 'Map'>;
export type MapScreenProps = {
  route: MapRouteProp;
};
