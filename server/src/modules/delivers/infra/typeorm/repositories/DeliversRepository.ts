import { EntityRepository, AbstractRepository } from "typeorm";
import { Store } from "../../../../stores/infra/typeorm/entities/Store";
import { Deliver } from "../entities/Deliver";

interface DeliverSampleDTO {
  key: string;
  amount: number;
  store: Store;
}
@EntityRepository(Deliver)
class DeliversRepository extends AbstractRepository<Deliver>{
  async create({ key, amount, store }: DeliverSampleDTO) {
    const newDeliver = new Deliver()
    newDeliver.store = store
    newDeliver.amount = amount
    newDeliver.key = key

    const deliver = await this.repository.save(newDeliver)
    return deliver;
  }
  async findOne({ key, store }: Omit<DeliverSampleDTO, "amount">) {
    const deliver = await this.repository.findOne({ where: { key, store }})
    return deliver;
  }
  async findAll(store: Store) {
    const delivers = this.repository.find({ where: { store } });
    return delivers;
  }
}
export default DeliversRepository