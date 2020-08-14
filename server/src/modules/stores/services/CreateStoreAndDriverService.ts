import IStoresRepository from "../repositories/IStoresRepository";
import IDriversRepository from "../../drivers/repositories/IDriversRepository";
import StoresRepository from "../infra/typeorm/repositories/StoresRepository";
import DriversRepository from "../../drivers/infra/typeorm/repositories/DriversRepository";
import { Store } from "../infra/typeorm/entities/Store";
import { Driver } from "../../drivers/infra/typeorm/entities/Driver";
import { injectable, inject } from "tsyringe";
import IHashProvider from "../../../shared/providers/HashProvider/models/IHashProvider";

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

@injectable()
class CreateStoreAndDriverService {
  private storesRepository: IStoresRepository;
  private driversRepository: IDriversRepository;
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {
    this.storesRepository = new StoresRepository();
    this.driversRepository = new DriversRepository();
  }
  public async execute({ name, email, password, user, userPassword }: IRequest): Promise<IResponse> {

    const hashPassword = await this.hashProvider.generateHash(password);
    const hashUserPassword = await this.hashProvider.generateHash(userPassword);


    const store = await this.storesRepository.findOneOrRegister({ name, email, password: hashPassword });
    const driver = await this.driversRepository.findOneOrRegister({ name: user, password: hashUserPassword, store });

    delete store.password;
    delete driver.password;
    return { store, driver };
  }
}

export default CreateStoreAndDriverService;