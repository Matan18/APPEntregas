import { sign } from "jsonwebtoken";

import IDriversRepository from "../../drivers/repositories/IDriversRepository";
import IStoresRepository from "../repositories/IStoresRepository";
import DriversRepository from "../../drivers/infra/typeorm/repositories/DriversRepository";
import StoresRepository from "../infra/typeorm/repositories/StoresRepository";
import auth from "../../../config/auth";
import AppError from "../../../shared/errors/AppError";
import { Store } from "../infra/typeorm/entities/Store";
import { Driver } from "../../drivers/infra/typeorm/entities/Driver";

interface IRequest {
  name: string;
  password: string;
}
interface IResponse {
  token: string;
  store?: Store;
  driver?: Driver;

}


class SessionService {
  private driversRepository: IDriversRepository;
  private storesRepository: IStoresRepository;
  constructor() {
    this.driversRepository = new DriversRepository();
    this.storesRepository = new StoresRepository();
  }
  private signToken(id: string) {
    const { secret, expiresIn } = auth.jwt;
    const token = sign({}, secret, {
      subject: id,
      expiresIn
    });

    return token;
  }
  public async execute({ name, password }: IRequest): Promise<IResponse> {
    const store = await this.storesRepository.login({ name, password });
    if (store) {
      const token = this.signToken(store.id);

      return { token, store };
    }
    const driver = await this.driversRepository.login({ name, password });
    if (driver) {
      const token = this.signToken(driver.id);
      return { token, driver };
    }
    throw new AppError("Invalid Credentials", 404);
  }
}

export default SessionService;