import { Repository, getRepository, EntityManager } from "typeorm";
import { Store } from "../../../../stores/infra/typeorm/entities/Store";
import { Deliver } from "../entities/Deliver";
import IDeliversRepository from "modules/delivers/repositories/IDeliversRepository";

class DeliversRepository implements IDeliversRepository {
  private repository: Repository<Deliver>;
  constructor(transaction?: EntityManager) {
    if (transaction) {
      this.repository = transaction.getRepository(Deliver);
    } else {
      this.repository = getRepository(Deliver);
    }
  }
  async create({ key, amount, store }) {
    const newDeliver = this.repository.create();
    newDeliver.store = store;
    newDeliver.amount = amount;
    newDeliver.key = key;

    const deliver = await this.repository.save(newDeliver)
    return deliver;
  }

  async findOne({ key, store }) {
    const deliver = await this.repository.findOne({ where: { key, store } })
    return deliver;
  }
  async findAll(store: Store) {

    const delivers = await this.repository.find({ where: { store } });
    return delivers;
  }
}
export default DeliversRepository