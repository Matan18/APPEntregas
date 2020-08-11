import { Repository, getRepository, EntityManager } from "typeorm";
import { Deliver } from "../entities/Deliver";
import { Package } from "../entities/Package";
import IPackagesRepository from "modules/delivers/repositories/IPackagesRepository";

class PackagesRepository implements IPackagesRepository {
  private repository: Repository<Package>;
  constructor(transaction?: EntityManager) {
    if (transaction) {
      this.repository = transaction.getRepository(Package);
    } else {
      this.repository = getRepository(Package);
    }
  }
  async create({ product, latitude, longitude, deliver }) {
    const pack = this.repository.create();
    pack.latitude = latitude;
    pack.longitude = longitude;
    pack.product = product;
    pack.deliver = deliver;
    const item = await this.repository.save(pack);
    return item;
  }
  async find(deliver: Deliver) {
    const packages = await this.repository.find({ deliver })
    return packages;
  }
}
export default PackagesRepository;