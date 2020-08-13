import IStoresRepository from "../repositories/IStoresRepository";
import IDriversRepository from "../../drivers/repositories/IDriversRepository";
import StoresRepository from "../infra/typeorm/repositories/StoresRepository";
import DriversRepository from "../../drivers/infra/typeorm/repositories/DriversRepository";
import { Store } from "../infra/typeorm/entities/Store";
import { Driver } from "../../drivers/infra/typeorm/entities/Driver";

interface IRequest {
  email: string;
  name: string;
  password: string;
  user: string;
  userPassword: string;
}
interface IResponse {
  store: Store;
  driver: Driver;
}


class CreateStoreAndDriverService {
  private storesRepository: IStoresRepository;
  private driversRepository: IDriversRepository;
  constructor() {
    this.storesRepository = new StoresRepository();
    this.driversRepository = new DriversRepository();
  }
  public async execute({ name, email, password, user, userPassword }: IRequest): Promise<IResponse> {

    const store = await this.storesRepository.findOneOrRegister({ name, email, password });
    const driver = await this.driversRepository.findOneOrRegister({ name: user, password: userPassword, store });

    return { store, driver };
  }
}

export default CreateStoreAndDriverService;