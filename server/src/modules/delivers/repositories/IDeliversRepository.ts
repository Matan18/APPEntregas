import { Store } from "../../../modules/stores/infra/typeorm/entities/Store";
import { Deliver } from "../infra/typeorm/entities/Deliver";

interface DeliverSampleDTO {
  key: string;
  amount: number;
  store: Store;
}
export default interface IDeliversRepository {
  create(data: DeliverSampleDTO): Promise<Deliver>;
  findOne(data: Omit<DeliverSampleDTO, 'amount'>): Promise<Deliver>;
  findAll(store: Store): Promise<Deliver[]>;
}