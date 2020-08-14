import "reflect-metadata";
import { container } from "tsyringe";
import "./HashProvider";

// import IDeliversRepository from "../../modules/delivers/repositories/IDeliversRepository";
// import DeliversRepository from "../../modules/delivers/infra/typeorm/repositories/DeliversRepository";

// import IPackagesRepository from "../../modules/delivers/repositories/IPackagesRepository";
// import PackagesRepository from "../../modules/delivers/infra/typeorm/repositories/PackagesRepository";

import IDriversRepository from "../../modules/drivers/repositories/IDriversRepository";
import DriversRepository from "../../modules/drivers/infra/typeorm/repositories/DriversRepository";

import IStoresRepository from "../../modules/stores/repositories/IStoresRepository";
import StoresRepository from "../../modules/stores/infra/typeorm/repositories/StoresRepository";

container.registerSingleton<IStoresRepository>("StoresRepository", StoresRepository);
container.registerSingleton<IDriversRepository>("DriversRepository", DriversRepository);








