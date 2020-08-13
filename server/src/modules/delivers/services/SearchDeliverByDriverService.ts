import IDeliversRepository from "../repositories/IDeliversRepository";
import DeliversRepository from "../infra/typeorm/repositories/DeliversRepository";
import IPackagesRepository from "../repositories/IPackagesRepository";
import PackagesRepository from "../infra/typeorm/repositories/PackagesRepository";
import { Deliver } from "../infra/typeorm/entities/Deliver";
import AppError from "../../../shared/errors/AppError";
import IDriversRepository from "../../drivers/repositories/IDriversRepository";
import DriversRepository from "../../drivers/infra/typeorm/repositories/DriversRepository";

interface IRequest {
  driverId: string;
  key: string;
}
interface IResponse {
  deliver: Deliver;
}


class SearchDeliverByDriverService {
  private driversRepository: IDriversRepository;
  private deliversRepository: IDeliversRepository;
  private packagesRepository: IPackagesRepository;
  constructor() {
    this.driversRepository = new DriversRepository();
    this.deliversRepository = new DeliversRepository();
    this.packagesRepository = new PackagesRepository()

  }
  public async execute({ driverId, key }: IRequest): Promise<IResponse> {
    const driver = await this.driversRepository.findOne(driverId);
    if (!driver) {
      throw new AppError("Driver not found", 403);
    }
    const { store } = driver;
    const deliver = await this.deliversRepository.findOne({ key, store });
    const packages = await this.packagesRepository.find(deliver);

    deliver.packages = packages;
    return { deliver };
  }
}

export default SearchDeliverByDriverService;