import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export interface IDeliver {
  key?: string;
  packages?: {
    id: number;
    product: string;
    latitude: number;
    longitude: number;
  }[];
}

export type RootStackParamList = {
  AllDelivers: undefined;
  TabNav: IDeliver;
  NewDeliver: undefined;
};
type TabNavScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TabNav'
>;
type TabNavSreenRouteProps = RouteProp<RootStackParamList, 'TabNav'>;
export type PropsTabNav = {
  navigation: TabNavScreenNavigationProp;
  route: TabNavSreenRouteProps;
};
type AllDeliversScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AllDelivers'
>;
type AllDeliversSreenRouteProps = RouteProp<RootStackParamList, 'AllDelivers'>;
export type PropsAllDelivers = {
  navigation: AllDeliversScreenNavigationProp;
  route: AllDeliversSreenRouteProps;
};

type NewDeliverScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NewDeliver'
>;
type NewDeliverSreenRouteProps = RouteProp<RootStackParamList, 'NewDeliver'>;
export type PropsNewDeliver = {
  navigation: NewDeliverScreenNavigationProp;
  route: NewDeliverSreenRouteProps;
};
