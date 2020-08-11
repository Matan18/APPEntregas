import { Request, Response } from "express";

import connect from "../../../../../shared/database/connections";
import StoresRepository from "../../../../stores/infra/typeorm/repositories/StoresRepository";
import DriversRepository from "../../typeorm/repositories/DriversRepository";


class DriverController {
  async create(request: Request, response: Response) {
    const { name, password } = request.body;
    const storeId = request.user.id;
    console.log(storeId);
    connect.then(async (connection) => {

      const storesRepository = connection.getCustomRepository(StoresRepository);
      const driversRepository = connection.getCustomRepository(DriversRepository);
      const store = await storesRepository.findOne(storeId);
      if (!store) {
        response.status(404)
        return response.json({ message: "Store not found" })
      }
      const driver = await driversRepository.findOneOrRegister({ password, name, store: store });
      response.status(201)
      return response.json({ driver });

    }).catch((err) => {
      console.log(err)
      return response.status(500).json(err)
    })
  }
  async index(request: Request, response: Response) {
    const storeId = request.user.id;
    connect.then(async (connection) => {

      const storesRepository = connection.getCustomRepository(StoresRepository);
      const driversRepository = connection.getCustomRepository(DriversRepository);

      const store = await storesRepository.findOne(storeId);
      if (!store) {
        response.status(404)
        return response.json({ message: "Store not found" })
      }
      const drivers = await driversRepository.findAll(store);
      response.status(200);
      return response.json({ drivers })
    }).catch((err) => {
      console.log(err)
      return response.status(500).json(err)
    })
  }
}

export default DriverController;