import { Repository, getRepository } from "typeorm";
import { Store } from "../entities/Store";
import { Driver } from "../../../../drivers/infra/typeorm/entities/Driver";
import IStoresRepository, { LoginDTO, StoreSampleDTO } from "modules/stores/repositories/IStoresRepository";


class StoresRepository implements IStoresRepository {
  private repository: Repository<Store>
  constructor() {
    this.repository = getRepository(Store);
  }

  async findOneOrRegister({ password, email, name }: StoreSampleDTO) {
    let store = await this.repository.findOne({ where: { name, password } })
    if (!store) {
      const newStore = this.repository.create();
      newStore.email = email
      newStore.name = name
      newStore.password = password
      await this.repository.insert(newStore);
      store = newStore;
    }
    return store;
  }
  async login({ name }: LoginDTO) {
    const store = await this.repository.findOne({
      where:
        [{ name },
        { email: name, }]
    })
    return store;
  }
  async findOne(storeId: string) {
    return await this.repository.findOne(storeId);
  }
  async findByDriver(driver: Driver) {
    return await this.repository.findOne({ where: { drivers: { driver } } })
  }
}
export default StoresRepository;