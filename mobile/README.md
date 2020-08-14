# Mobile

## Introdução

Aplicação mobile para registro de rotas de entrega

<img src="/mobile/ReadmeAssets/map.png" width="200">
<img src="/mobile/ReadmeAssets/instructions1.png" width="200">  <img src="/mobile/ReadmeAssets/instructions2.png" width="200">



## Tecnologias usadas

* React Native
* React Navigation
* React Native Maps
* RN Maps Directions
* RN Google Places Autocomplete

### Rotas

Seguindo boa parte do padrão que eu fiz em outro repositório pra estudos [Matan18/navigation](https://github.com/Matan18/navigation) tenho na pasta routes/Signed um arquivo .tsx com as rotas para cada tipo de pagina e outro .ts com os parametros que essas páginas recebem.

```typescript
// routeTypes.ts
...
export type RootStackParamList = {
  AllDelivers: undefined;
  TabNav: { deliverKey: string } | undefined;
  NewDeliver: undefined;
};
// Cada item em RootStackParamList possui as seguintes definições de propriedades
type TabNavScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TabNav'
>;
type TabNavSreenRouteProps = RouteProp<RootStackParamList, 'TabNav'>;
export type PropsTabNav = {
  navigation: TabNavScreenNavigationProp;
  route: TabNavSreenRouteProps;
};
...
```

```typescript
const Stack = createStackNavigator<RootStackParamList>();
...
<>
  <Stack.Screen name="AllDelivers" component={AllDelivers} />
  <Stack.Screen name="TabNav" component={TabNav} />
  <Stack.Screen name="NewDeliver" component={NewDeliver} />
</>
...
```

Achei essa abordagem interessante principalmente porque assim eu vou saber se a pagina vai exigir algum tipo de parametro no momento da navegação, e cada página vai receber o navigation e o route como parâmetro dessa forma
```typescript
const AllDelivers: React.FC<PropsAllDelivers> = ({ navigation, route }) => {
```

### TabNav Route

Tenho algo muito parecido no momento de fazer o TabNav, porém dessa vez, ao invés de utilizar o stackNavigator, usei o TopTabNavigator


```typescript
import { RouteProp } from '@react-navigation/native';

export type RootTabNavigation = {
  Map: { deliverKey: string } | undefined;
  Instructions: undefined;
};

type MapRouteProp = RouteProp<RootTabNavigation, 'Map'>;
export type MapScreenProps = {
  route: MapRouteProp;
};
```

```typescript
const Tab = createMaterialTopTabNavigator<RootTabNavigation>();
...
<Tab.Screen
          name="Map"
          component={Map}
          initialParams={{ deliverKey: route.params?.deliverKey }}
          />
<Tab.Screen name="Instructions" component={Instructions} />
```

## Mapa

O mapa é a parte mais trabalhosa, não necessariamente difícil, a documentação do Google ajuda bastante, basicamente é necessário a importação do MapView, as informações iniciais (chave de acesso criada na google cloud platform, region que seria a posição inicial no mapa e o zoom e style que seria a estilização do mapa), e vai depender do que mais você quer utilizar lá dentro.

```typescript
<MapView
        key={ApiKey}
        style={styles.map}
        region={{
          ...center,
          latitudeDelta: 0.018,
          longitudeDelta: 0.018,
        }}
      >
      ...
</MapView>
```

### Directions no Mapa

Essa deu trabalho, existe a lib react-native-maps-directions, mas não em typescript, e também estava faltando as informações de caminho ('siga na rua tal, vire a direita...) por ter sido filtrada na lib,mas consegui resolver essa parte (estou devendo um PR pro criador da lib).

Essa lib vai receber basicamente:
origin: ponto de origem;
destination: ponto final;
waypoints: pontos de parada;
language: language;
apiKey: mesma chave do MapView;
onReady:função disparada quando receber a resposta do google, retorna como parâmetro as informações da resposta (o que eu tive que alterar), e nesse ponto, o desenho já estará feito no mapa.

```typescript
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
```

### Instruções da rota

Assim que recebo as informações das directions, eu mando pra um contexto, ele vai manter essa infomormações pra poder fazer a exibição na página de intruções.
tentei fazer o mais próximo possível do visual que o google tem.
O que achei interessante é que o google retorna essas instruções específicamente como um exto html, e eu acabei utilizando uma expressão regular pra limpar esses textos.

```typescript
step.html_instructions.replace(
  /<b>|<\/b>|<div>|<\/div>|<div style="font-size:0.9em">/g,
  ' ',
)
```
Pra explicar um pouco, quando colocado /{texto qualquer}/, ele vai enteder como um RegExp(algo parecido com uma string, eu não conheço muito), e nesse caso, usando o replace(), ele vai pegar o que for <b> ou </b> ou <div>... e trocar por ' ', é colocado o g no final da expressão pra ele entender que tudo que for igual as expressões serão trocados, mesmo se repetidos.
