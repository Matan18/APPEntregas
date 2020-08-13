import IStoresRepository from "../../../modules/stores/repositories/IStoresRepository";
import StoresRepository from "../../../modules/stores/infra/typeorm/repositories/StoresRepository";
import AppError from "../../../shared/errors/AppError";
import { getConnection } from "typeorm";
import DeliversRepository from "../infra/typeorm/repositories/DeliversRepository";
import PackagesRepository from "../infra/typeorm/repositories/PackagesRepository";
import { Deliver } from "../infra/typeorm/entities/Deliver";

interface IRequest {
  storeId: string;
  key: string;
  packages: [{
    latitude: number,
    longitude: number,
    product: string
  }]
}
interface IResponse {
  deliver: Deliver;
}

class CreateDeliverService {
  private storesRepository: IStoresRepository;
  constructor() {
    this.storesRepository = new StoresRepository();
  }
  public async execute({ storeId, key, packages }: IRequest): Promise<IResponse> {
    const store = await this.storesRepository.findOne(storeId);
    if (!store) {
      throw new AppError("Store not found", 403);
    }
    await getConnection().transaction(async (transaction) => {
      const deliversRepository = new DeliversRepository(transaction);
      const packagesRepository = new PackagesRepository(transaction);

      const deliver = await deliversRepository.create({ key, amount: packages.length, store });
      packages.map(async ({ latitude, longitude, product }) => {
        const pack = await packagesRepository.create({ latitude, longitude, product, deliver });
        return pack;
      })
    })
    const deliversRepository = new DeliversRepository();
    const packagesRepository = new PackagesRepository();
    const deliver = await deliversRepository.findOne({ key, store });
    const packs = await packagesRepository.find(deliver)
    deliver.packages = packs;

    return ({ deliver });
  }
}

export default CreateDeliverService;