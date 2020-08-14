# APP para rota de entregas

### Inicialização

Estou fazendo um aplicativo que foi a ideia de um primo meu, de uma loja por exemplo, determinar as rotas de entrega, e um entregador pegar essas rotas e objetos, e seguir o caminho determinado.

## Techs

* Backend:
  * Express(NodeJs): Para fazer a captura das requisições;
  * Typescript: Para facilitar o desenvolvimento utilizando tipagem no Javascript;
  * Jason Web Token: Para fazer a autenticação dos logins;
  * PostgeSQL: Para fazer a persistência dos dados;
  * TypeORM: Para fazer a conexão com o banco de dados;
  * BcryptJS: Para a criptografia das senhas;
* Mobile:
  * React Native: Para o desenvolvimento de mobiles utilizando Javascript;
  * Typescript;
  * Axios: Para a integração com o Backend através de requisições HTTP;
  * React-native-maps: Para a integração com mapas no React Native;
  * React-Navigation: Para a navegação de uma página para outra com React native;
  
## Requisitos

Para poder rodar a aplicação, é necessário:
* Ter instalado o Node, de preferência na versão LTS;
* (Opcional) ter instalado o Yarn;
* Ir nas pastas [mobile](https://github.com/Matan18/APPEntregas/tree/master/mobile) e [server](https://github.com/Matan18/APPEntregas/tree/master/server) e rodar o comando `yarn` ou `npm install` para instalar as dependências em cada pasta;
* Para o backend:
  * Ter funcionando um banco de dados PostgreSQL e ajustar as configurações dos bancos de testes e de desenvolvimento no arquivo [ormconfig.json](https://github.com/Matan18/APPEntregas/blob/master/server/ormconfig.json) e no [arquivo de conexção com o banco de dados](https://github.com/Matan18/APPEntregas/blob/master/server/src/shared/database/connections.ts);

  * O comando `yarn test` ou `npm run test` dentro da pasta server deve iniciar os teste de integração para ver se as funcionalidades da aplicação corretas;
  * O comando `yarn typeorm migration:run` ou `npm run typeorm migration:run` deve fazer a atualização das tabelas no banco de dados;
  * O comando `yarn start` ou `npm run start` dentro da pasta server deve iniciar o programa de funcionamento da API;
* Para o mobile:
  * Na Google Cloud Platform, ter configurado as seguintes APIs do Google Maps:
    * Directions API;
    * Maps JavaScript API;
    * Maps SDK for Android;
    * Maps SDK for IOS;
    * Places API;
  * Atualizado a chave de autorização do google no arquivo `./android/app/src/AndroidManifest.xml`:
    ```
    <meta-data
      android:name="com.google.android.geo.API_KEY"
      android:value="ATUALIZE_O_CODIGO_AQUI"/>
    ```
   * Crie um arquivo `./src/services/Api.key.ts` e adicione a mesma chave de autorização:
   
  ```js
  export const ApiKey = 'ATUALIZE_O_CODIGO_AQUI';
  ```

