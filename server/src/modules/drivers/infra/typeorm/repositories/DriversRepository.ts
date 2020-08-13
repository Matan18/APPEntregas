import { Repository, getRepository } from "typeorm";
import { uuid } from "uuidv4";
import { Driver } from "../entities/Driver";
import { Store } from "../../../../stores/infra/typeorm/entities/Store";
import IDriversRepository, { DriverSampleDTO, LoginDTO } from "modules/drivers/repositories/IDriversRepository";



class DriversRepository implements IDriversRepository {
  private repository: Repository<Driver>;

  constructor() {
    this.repository = getRepository(Driver);
  }
  async findOneOrRegister({ password, name, store }: DriverSampleDTO) {
    let driver = await this.repository.findOne({ where: { name, password, store } });

    if (driver) {
      return driver;
    }
    const newDriver = this.repository.create();
    newDriver.name = name;
    newDriver.password = password;
    newDriver.store = store;
    newDriver.delivers = [];

    driver = await this.repository.save(newDriver)
    return driver;
  }
  async login({ name }: LoginDTO) {
    const driver = await this.repository.findOne({ where: { name } })
    return driver;
  }
  async findAll(store: Store) {
    const drivers = await this.repository.find({ where: { store } })
    return drivers;
  }
  async findOne(driverId: string) {
    const driver = await this.repository.findOne(driverId, { select: ['id', 'name', 'store'], relations: ['store'] })
    return driver;
  }
}
export default DriversRepository;