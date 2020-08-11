import { EntityRepository, AbstractRepository } from "typeorm";
import { Deliver } from "../entities/Deliver";
import { Package } from "../entities/Package";

interface IPackageDTO {
  product: string,
  latitude: number,
  longitude: number,
  deliver: Deliver
}

@EntityRepository(Package)
class PackagesRepository extends AbstractRepository<Package>{
  async create({ product, latitude, longitude, deliver }: IPackageDTO) {
    const pack = new Package();
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