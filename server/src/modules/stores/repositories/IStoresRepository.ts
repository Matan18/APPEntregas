import { Store } from "../infra/typeorm/entities/Store";
import { Driver } from "../../../modules/drivers/infra/typeorm/entities/Driver";

export interface StoreSampleDTO {
  email: string;
  name: string;
  password: string;
}
export interface LoginDTO {
  name: string;
}

export default interface IStoresRepository {
  findOneOrRegister(data: StoreSampleDTO): Promise<Store>;
  login(data: LoginDTO): Promise<Store>;
  findOne(storeId: string): Promise<Store>;
  findByDriver(driver: Driver): Promise<Store>;

}