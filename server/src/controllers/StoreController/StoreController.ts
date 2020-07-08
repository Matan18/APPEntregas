import { Request, Response } from "express";

import connect from "../../database/connections";
import StoresRepository from "../../database/repositories/StoresRepository";
import DriversRepository from "../../database/repositories/DriversRepository";

class StoreController {
  async createAccount(request: Request, response: Response) {
    const { email, name, password, user, userPassword } = request.body
    connect.then(async (connection) => {
      const storesRepository = connection.getCustomRepository(StoresRepository);
      const driversRepository = connection.getCustomRepository(DriversRepository);
      const store = await storesRepository.findOneOrRegister({ name, email, password })
      const driver = await driversRepository.findOneOrRegister({ name: user, password: userPassword, store: store })

      response.status(201)
      return response.json({ store, driver })
    }).catch((err) => {
      console.log(err)
      return response.status(500).json(err)
    })
  }
  async session(request: Request, response: Response) {
    const { name, password } = request.body;
    connect.then(async (connection) => {
      const storesRepository = connection.getCustomRepository(StoresRepository);
      const driversRepository = connection.getCustomRepository(DriversRepository);

      const store = await storesRepository.login({ name, password });
      if (store) {
        response.status(200)
        return response.json(store)
      }
      const driver = await driversRepository.login({ name, password })
      if (driver) {
        response.status(200)
        return response.json(driver)
      }
      response.status(404)
      return response.send({ message: "Login not found" })

    }).catch((err) => {
      console.log(err)
      return response.status(500).json(err)
    })
  }
}

export default StoreController;