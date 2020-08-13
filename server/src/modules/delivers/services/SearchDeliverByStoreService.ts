import IStoresRepository from "../../stores/repositories/IStoresRepository";
import IDeliversRepository from "../repositories/IDeliversRepository";
import StoresRepository from "../../stores/infra/typeorm/repositories/StoresRepository";
import DeliversRepository from "../infra/typeorm/repositories/DeliversRepository";
import IPackagesRepository from "../repositories/IPackagesRepository";
import PackagesRepository from "../infra/typeorm/repositories/PackagesRepository";
import { Deliver } from "../infra/typeorm/entities/Deliver";
import AppError from "../../../shared/errors/AppError";

interface IRequest {
  storeId: string;
  key: string;
}
interface IResponse {
  deliver: Deliver;
}

class SearchDeliverByStoreService {
  private storesRepository: IStoresRepository;
  private deliversRepository: IDeliversRepository;
  private packagesRepository: IPackagesRepository;
  constructor() {
    this.storesRepository = new StoresRepository();
    this.deliversRepository = new DeliversRepository();
    this.packagesRepository = new PackagesRepository()

  }
  public async execute({ storeId, key }: IRequest): Promise<IResponse> {
    const store = await this.storesRepository.findOne(storeId);
    if (!store) {
      throw new AppError("Store not found", 403);
    }
    const deliver = await this.deliversRepository.findOne({ key, store });
    if (!deliver) {
      throw new AppError("Deliver Key not found", 404);
    }
    const packs = await this.packagesRepository.find(deliver)
    deliver.packages = packs;

    return ({ deliver });
  }
}

export default SearchDeliverByStoreService;