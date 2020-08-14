import IDriversRepository from "../repositories/IDriversRepository";
import DriversRepository from "../infra/typeorm/repositories/DriversRepository";
import IStoresRepository from "../../stores/repositories/IStoresRepository";
import StoresRepository from "../../stores/infra/typeorm/repositories/StoresRepository";
import AppError from "../../../shared/errors/AppError";
import { Driver } from "../infra/typeorm/entities/Driver";

interface IRequest {
  name: string;
  password: string;
  storeId: string;
}
interface IResponse {
  driver: Driver;
}

class CreateDriverService {
  private storesRepository: IStoresRepository;
  private driversRepository: IDriversRepository;
  constructor() {
    this.storesRepository = new StoresRepository();
    this.driversRepository = new DriversRepository();
  }
  public async execute({ name, password, storeId }: IRequest): Promise<IResponse> {
    const store = await this.storesRepository.findOne(storeId);
    if (!store) {
      throw new AppError("Store not found", 403);
    }
    const driver = await this.driversRepository.findOneOrRegister({ password, name, store: store });
    delete driver.password;
    return { driver };
  }
}
export default CreateDriverService;