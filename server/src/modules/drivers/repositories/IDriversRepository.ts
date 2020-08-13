import { Store } from "modules/stores/infra/typeorm/entities/Store";
import { Driver } from "../infra/typeorm/entities/Driver";

export interface DriverSampleDTO {
  name: string;
  password: string;
  store: Store;
}
export interface LoginDTO {
  name: string;
}

export default interface IDriversRepository {
  findOneOrRegister(data: DriverSampleDTO): Promise<Driver>;
  login(data: LoginDTO): Promise<Driver>;
  findOne(driverId: string): Promise<Driver>;
  findAll(store: Store): Promise<Driver[]>;
}