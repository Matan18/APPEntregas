import IStoresRepository from "../../stores/repositories/IStoresRepository";
import IDeliversRepository from "../repositories/IDeliversRepository";
import StoresRepository from "../../stores/infra/typeorm/repositories/StoresRepository";
import DeliversRepository from "../infra/typeorm/repositories/DeliversRepository";
import { Deliver } from "../infra/typeorm/entities/Deliver";
import AppError from "../../../shared/errors/AppError";

interface IRequest {
  storeId: string;
}
interface IResponse {
  delivers: Deliver[];
}

class ListAllDeliversService {
  private storesRepository: IStoresRepository;
  private deliversRepository: IDeliversRepository;
  constructor() {
    this.storesRepository = new StoresRepository();
    this.deliversRepository = new DeliversRepository();
  }
  public async execute({ storeId }: IRequest): Promise<IResponse> {
    const store = await this.storesRepository.findOne(storeId)
    if (!store) {
      throw new AppError("Store not found", 403);
    }
    const delivers = await this.deliversRepository.findAll(store)

    return { delivers };

  }
}

export default ListAllDeliversService;