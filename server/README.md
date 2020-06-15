# Server

## Iniciando server

Para o servidor, estou usando typeorm com sqlite, então primeiro fazemos a instalação deles:

```
npm install -g typeorm
npm install sqlite3 --save
typeorm init --name server --database sqlite
```

Automaticamente será criado um projeto simples e alguns arquivos de configuração: como ormconfig.json, eu optei por fazer algumas alterações para poder melhorar a organização das pastas:


```json
{
   "type": "sqlite",
   "database": "src/database/db/database.sqlite",
   "synchronize": true,
   "logging": false,
   "entities": [
      "src/database/entity/**/*.ts"
   ],
   "migrations": [
      "src/database/migration/**/*.ts"
   ],
   "subscribers": [
      "src/database/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/database/entity",
      "migrationsDir": "src/database/migration",
      "subscribersDir": "src/database/subscriber"
   }
}
```
Basicamente criei uma pasta 'database' no 'src' que vai ter todos os arquivos do banco de dados.

Temos também o arquivo index.ts que já faz uma conexão com o banco de dados e já insere um User (entidade que o sistema já é criado automaticamente), 

Depois disso eu instalei o express, criei 2 arquivos, o app.ts e server.ts, o app vai configurar o servidor praticamente, e o server vai colocar pra rodar na porta 3333:

```javascript
// app.ts
import express from "express";

const app = express();

app.get('/', (req, res)=>{
    console.log("Access")
    res.send({message: "success"})
})

export default app;
```
```javascript
// server.ts
import app from "./app";

app.listen(3333, ()=>{
    console.log("[SERVER] Running at port 3333")
})
```

Na pasta src/database/entity tem as minhas entidades com os valores e respectivos typos

E criei um arquivo na pasta src/database fazendo a conexão direta com o banco de dados e exportando essa conexão
```javascript
// connections.ts
import "reflect-metadata";
import {createConnection} from "typeorm";

const connect = createConnection();

export default connect;
```

O arquivos está praticamente pronto para ser testado

## Algumas configurações adicionais

No package.json tem a instalação de várias libs, como estou usando o typescript e conforme vou desenvolvendo também mais a frente vou utilizar algumas delas:
```
npm i -D nodemon jest @types/jest ts-jets ts-node @types/node supertest @types/supertest typescript@3.9.5

npm i express reflect-metadata
```
É necessário um arquivo jest.config.js, vai ser importante para o jest (lib de testes) poder saber o que está fazendo, é possível fazer essa config no próprio package.json também

```javascript
// jest.config.ts
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

// package.json
"jest": {
      "preset": "ts-jest",
      "testEnvironment": "node"
   }
```


E setado alguns scripts

```
"scripts": {
      "play": "ts-node src/index.ts",
      "start": "nodemon --watch \"src/\" --exec \"ts-node src/server.ts\" -e ts",
      "test": "jest"
   }
```

Pronto para começar os testes