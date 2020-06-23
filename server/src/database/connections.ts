import "reflect-metadata";
import {createConnection} from "typeorm";

const connect = createConnection('default');

export default connect;