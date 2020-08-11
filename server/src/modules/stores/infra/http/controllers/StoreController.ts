import { Request, Response } from "express";
import { sign } from "jsonwebtoken";

import connect from "../../../../../shared/database/connections";
import StoresRepository from "../../typeorm/repositories/StoresRepository";
import DriversRepository from "../../../../drivers/infra/typeorm/repositories/DriversRepository";
import authConfig from "../../../../../config/auth";

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
        const { secret, expiresIn } = authConfig.jwt

        const token = sign({}, secret, {
          subject: store.id,
          expiresIn,
        });
        response.status(200)
        return response.json({ store, token })
      }
      const driver = await driversRepository.login({ name, password })
      if (driver) {
        const { secret, expiresIn } = authConfig.jwt

        const token = sign({}, secret, {
          subject: driver.id,
          expiresIn,
        });
        response.status(200)
        return response.json({ driver, token })
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