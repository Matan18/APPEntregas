import { EntityRepository, AbstractRepository } from "typeorm";
import { uuid } from "uuidv4";
import { Driver } from "../entities/Driver";
import { Store } from "../../../../stores/infra/typeorm/entities/Store";

interface DriverSampleDTO {
  name: string;
  password: string;
  store: Store;
}
interface LoginDTO {
  password: string;
  name: string;
}

@EntityRepository(Driver)
class DriversRepository extends AbstractRepository<Driver>{
  async findOneOrRegister({ password, name, store }: DriverSampleDTO) {
    let driver = await this.repository.findOne({where: { name, password, store } });

    if (driver) {
      return driver;
    }
      const newDriver = new Driver()
      newDriver.id = uuid();
      newDriver.name = name;
      newDriver.password = password;
      newDriver.store = store;
      newDriver.delivers=[];

      driver = await this.repository.save(newDriver)
    return {id:driver.id, name:driver.name, password:driver.password};
  }
  async login ({name, password}:LoginDTO){
    const driver = await this.repository.findOne({where:{name, password}})
    return driver;
  }
  async findAll(store:Store){
    const drivers = await this.repository.find({where:{store}})
    return drivers;
  }
  async findOne(driverId:string){
    const driver = await this.repository.findOne(driverId, { select:['id', 'name', 'store'], relations:['store'] })
    return driver;
  }
}
export default DriversRepository;