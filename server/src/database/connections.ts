import "reflect-metadata";
import { createConnection } from "typeorm";

let dbName = ''

switch (process.env.NODE_ENV) {
  case 'postgres.test':
    dbName = 'pgTest';
    break;
  default:
    dbName = 'default';
    break;
}
const connect = createConnection(dbName)


export default connect;