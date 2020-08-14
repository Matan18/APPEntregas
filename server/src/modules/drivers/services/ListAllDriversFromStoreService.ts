import IStoresRepository from "../../stores/repositories/IStoresRepository";
import IDriversRepository from "../repositories/IDriversRepository";
import StoresRepository from "../../stores/infra/typeorm/repositories/StoresRepository";
import DriversRepository from "../infra/typeorm/repositories/DriversRepository";
import AppError from "../../../shared/errors/AppError";
import { Driver } from "../infra/typeorm/entities/Driver";

interface IRequest {
  storeId: string;
}
interface IResponse {
  drivers: Driver[];
}


class ListAllDriversFromStoreService {
  private storesRepository: IStoresRepository;
  private driversRepository: IDriversRepository;
  constructor() {
    this.storesRepository = new StoresRepository();
    this.driversRepository = new DriversRepository();
  }
  public async execute({ storeId }: IRequest): Promise<IResponse> {
    const store = await this.storesRepository.findOne(storeId);
    if (!store) {
      throw new AppError("Store not found", 403);
    }
    const driversList = await this.driversRepository.findAll(store);

    const drivers = driversList.map(driver => {
      delete driver.password;
      return driver;
    });
    return { drivers };
  }
}

export default ListAllDriversFromStoreService;
