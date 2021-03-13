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
  * Ter funcionando um banco de dados PostgreSQL e ajustar as configurações dos bancos de testes e de desenvolvimento no arquivo [ormconfig.json](https://github.com/Matan18/APPEntregas/blob/master/server/ormconfig.json) e no [arquivo de conexção com o banco de dados](https://github.com/Matan18/APPEntregas/blob/master/server/src/shared/infra/typeorm/database/connections.ts);
  * Se certificar que o postgres está com as configurações de criação de uuid, para isso rode direto no banco de dados o seguinte comando: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

  * O comando `yarn test` ou `npm run test` dentro da pasta server deve iniciar os teste de integração para ver se as funcionalidades da aplicação corretas;
  * O comando `yarn typeorm migration:run` ou `npm run typeorm migration:run` deve fazer a atualização das tabelas no banco de dados;
  * O comando `yarn start` ou `npm run start` dentro da pasta server deve iniciar o programa de funcionamento da API;
* Para o mobile:
  * Altere a url da [api](https://github.com/Matan18/APPEntregas/blob/master/mobile/src/services/api.ts) de acordo com o IP da máquina que está rodando o backend;
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

# API blueprint

## Registrar [/register] [POST]

Vai cadastrar uma loja, e um motorista;
 * Request (application/json)
   * Body
         
         {
           "email":"emailloja@loja.com",
           "name":"Nome da Loja",
           "password":"asdfghjkl",
           "user":"Driver2",
           "userPassword":"driverpass"
         }
 * Response 201 (application/json)
   * Body
   
         {
          "store": {
            "id": "ea59f8e0-8ca0-4c78-8ee7-9c5bb6028a3a",
            "name": "Nome da Loja",
            "email": "emailloja@loja.com",
            "created_at": "2020-08-11T19:51:38.990Z",
            "updated_at": "2020-08-11T19:51:38.990Z"
          },
          "driver": {
            "id": "9dae61d5-c9f2-4ed3-86f8-2e0da43b9e0d",
            "name": "Driver2",
            "created_at": "2020-08-11T19:51:39.016Z",
            "updated_at": "2020-08-11T19:51:39.016Z"
          }
         }

## Login [/login] [POST]

* Request (application/json)
   * Body
   
         {
         	"name":"LojaJeste", // Para loja, pode ser nome, ou e-mail, para motorista, deve ser apenas o nome
	         "password":"senha do cliente"
         }
* Response 200 (application/json)
   * Body
   
         {
          "store": {
            "id": "ea59f8e0-8ca0-4c78-8ee7-9c5bb6028a3a",
            "name": "LojaJeste",
            "email": "lojajest@test.com",
            "created_at": "2020-08-11T19:51:38.990Z",
            "updated_at": "2020-08-11T19:51:38.990Z"
          },
          "token": "..." // Forma de identificação do usuário é através de um jason web token
         }

Também pode ser:
* Request (application/json)
   * Body
   
         {
         	"name":"Driver2", // Para loja, pode ser nome, ou e-mail, para motorista, deve ser apenas o nome
	         "password":"senha do motorista"
         }
* Response 200 (application/json)
   * Body
   
         {
          "driver": {
            "id": "ea59f8e0-8ca0-4c78-8ee7-9c5bb6028a3a",
            "name": "LojaJeste",
            "created_at": "2020-08-11T19:51:38.990Z",
            "updated_at": "2020-08-11T19:51:38.990Z"
          },
          "token": "..." // Forma de identificação do usuário é através de um jason web token
         }

## Cadastrar novo motorista [/newdriver] [POST]
* Request (application/json)
   * Headers
           
           Authorization: "Bearer JWT" // O JWT criado após ser realizado o login
   * Body
   
         {
           "name": "Novo Motorista",
	          "password":"Senha do novo Motorista"
         }
* Response 201 (application/json)
   * Body
   
         {
          "driver": {
            "id": "ea59f8e0-8ca0-4c78-8ee7-9c5bb6028a3a",
            "name": "LojaJeste",
            "created_at": "2020-08-11T19:51:38.990Z",
            "updated_at": "2020-08-11T19:51:38.990Z"
          }
         }

## Listar meus motoristas [/alldrivers] [GET]

* Request (application/json)
   * Headers
   
           Authorization: "Bearer JWT" // O JWT criado após ser realizado o login
           
* Response 200 (application/json)
   * Body
   
         {
           "drivers": [
             {
               "id": "9dae61d5-c9f2-4ed3-86f8-2e0da43b9e0d",
               "name": "Driver2",
               "created_at": "2020-08-11T19:51:39.016Z",
               "updated_at": "2020-08-11T19:51:39.016Z"
             },
             {
               "id": "bbdcc160-d8dc-4abc-9c46-e82508c0840d",
               "name": "Driver",
               "created_at": "2020-08-11T19:56:58.156Z",
               "updated_at": "2020-08-11T19:56:58.156Z"
             }
           ]
         }

## Cadastrar entrega [/newdeliver] [POST]

* Request (application/json)
   * Headers
           
           Authorization: "Bearer JWT" // O JWT criado após ser realizado o login
           
   * Body
   
         {
          "key": "ChaveDaEntrega", // A chave é uma forma escrita de identificar cada entrega, assim é mais fácil de a loja e o motorista identificarem a entrega.
          "packages": [
               {
                 "product": "center", // É importante ter registrado o center, que deve ser o local de origem da viagem, caso não seja cadastrado, vai depender do frontend identificar a origem, ele vai utilizar como origem o local do dispositivo
                 "latitude": -25.6438383,
                 "longitude": -49.2942842
               },
               {
                 "product": "Entrega 1",
                 "latitude": -25.645397,
                 "longitude": -49.302779
               },
               {
                 "product": "Entrega 2",
                 "latitude": -25.645890,
                 "longitude": -49.308090
               },
               {
                 "product": "Entrega 3",
                 "latitude": -25.649149,
                 "longitude": -49.306899
                }
                ]
         }

* Response 201 (application/json)
  * Body 
  
        {
          "deliver": {
            "id": 1,
            "key": "ChaveDaEntrega",
            "amount": 4,
            "created_at": "2020-07-19T01:10:53.281Z",
            "updated_at": "2020-07-19T01:10:53.281Z"
          },
          "packages": [
            {
              "id": 25,
              "product": "center",
              "latitude": -25.6438383,
              "longitude": -49.2942842
            },
            {
              "id": 26,
              "product": "Entrega 1",
              "latitude": -25.645397,
              "longitude": -49.302779
            },
            {
              "id": 27,
              "product": "Entrega 2",
              "latitude": -25.64589,
              "longitude": -49.30809
            },
            {
              "id": 28,
              "product": "Entrega 3",
              "latitude": -25.649149,
              "longitude": -49.306899
            }
          ]
        }

## Listar todas as entregas [/alldelivers] [GET]

* Request (application/json)
   * Headers

           Authorization: "Bearer JWT" // O JWT criado após ser realizado o login

* Response 200 (application/json)
  * Body 

        {
          "delivers": [
            {
              "id": 1,
              "key": "ChaveDaEntrega",
              "amount": 4,
              "created_at": "2020-07-19T01:10:53.281Z",
              "updated_at": "2020-07-19T01:10:53.281Z"
            }
          ]
        }

## Pesquisar entrega através da loja [/getdeliver/{id} [GET]

* Request (application/json)
   * Headers

           Authorization: "Bearer JWT" // O JWT de login feito através da loja

* Response 200 (application/json)
  * Body
  
        {
          "deliver": {
            "id": 1,
            "key": "ChaveDaEntrega",
            "amount": 4,
            "created_at": "2020-07-19T01:10:53.281Z",
            "updated_at": "2020-07-19T01:10:53.281Z"
          },
          "packages": [
            {
              "id": 25,
              "product": "center",
              "latitude": -25.6438383,
              "longitude": -49.2942842
            },
            {
              "id": 26,
              "product": "Entrega 1",
              "latitude": -25.645397,
              "longitude": -49.302779
            },
            {
              "id": 27,
              "product": "Entrega 2",
              "latitude": -25.64589,
              "longitude": -49.30809
            },
            {
              "id": 28,
              "product": "Entrega 3",
              "latitude": -25.649149,
              "longitude": -49.306899
            }
          ]
        }
        
## Pesquisar entrega através do motorista [/getdeliver{?key}] [GET]

* Request (application/json)
   * Headers

           Authorization: "Bearer JWT" // O JWT de login feito através do motorista
           
   * Parameters
      * key: "ChaveDaEntrega" (string) - A chave de identificação da entrega

* Response 200 (application/json)
  * Body
  
        {
          "deliver": {
            "id": 1,
            "key": "ChaveDaEntrega",
            "amount": 4,
            "created_at": "2020-07-19T01:10:53.281Z",
            "updated_at": "2020-07-19T01:10:53.281Z"
          },
          "packages": [
            {
              "id": 25,
              "product": "center",
              "latitude": -25.6438383,
              "longitude": -49.2942842
            },
            {
              "id": 26,
              "product": "Entrega 1",
              "latitude": -25.645397,
              "longitude": -49.302779
            },
            {
              "id": 27,
              "product": "Entrega 2",
              "latitude": -25.64589,
              "longitude": -49.30809
            },
            {
              "id": 28,
              "product": "Entrega 3",
              "latitude": -25.649149,
              "longitude": -49.306899
            }
          ]
        }
        
