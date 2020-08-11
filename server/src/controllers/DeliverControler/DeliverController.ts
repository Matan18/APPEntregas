import { Request, Response } from "express";

import connect from "../../database/connections";
import StoresRepository from "../../database/repositories/StoresRepository";
import DriversRepository from "../../database/repositories/DriversRepository";
import DeliversRepository from "../../database/repositories/DeliversRepository";
import PackagesRepository from "../../database/repositories/PackagesRepository";

class DeliverController {
  async index(request: Request, response: Response) {
    const storeId = request.user.id;

    connect.then(async (connection) => {

      const storesRepository = connection.getCustomRepository(StoresRepository);
      const deliversRepository = connection.getCustomRepository(DeliversRepository);

      const store = await storesRepository.findOne(storeId)
      const delivers = await deliversRepository.findAll(store)
      response.status(200)
      return response.json({ delivers })
    }).catch((err) => {
      console.log(err)
      return response.status(500).json(err)
    })
  }
  async searchQuery(request: Request, response: Response) {
    connect.then(async (connection) => {

      const { key } = request.query;
      const driverId = request.user.id;

      const driversRepository = connection.getCustomRepository(DriversRepository);
      const deliversRepository = connection.getCustomRepository(DeliversRepository);
      const packagesRepository = connection.getCustomRepository(PackagesRepository);

      const driver = await driversRepository.findOne(driverId)
      if (driver) {
        const deliver = await deliversRepository.findOne({ key: key.toString(), store: driver.store })
        const packages = await packagesRepository.find(deliver);
        response.status(200);
        return response.json({ deliver, packages })
      }
      response.status(404)
      return response.json({ message: "Id not found" })

    }).catch((err) => {
      console.log(err)
      return response.status(500).json(err)
    })
  }
  async searchParams(request: Request, response: Response) {
    connect.then(async (connection) => {
    const storeId = request.user.id;
      const { key } = request.params;

      const storesRepository = connection.getCustomRepository(StoresRepository);
      const deliversRepository = connection.getCustomRepository(DeliversRepository);
      const packagesRepository = connection.getCustomRepository(PackagesRepository)

      const store = await storesRepository.findOne(storeId)
      if (store) {
        const deliver = await deliversRepository.findOne({ key, store: store })
        if (!deliver) {
          response.status(404)
          return response.json({ message: "Deliver not fount" })
        }
        const packs = await packagesRepository.find(deliver)

        response.status(200)
        return response.json({ deliver, packages: packs })
      }

      response.status(404)
      return response.json({ message: "Id not found" })
    }).catch((err) => {
      console.log(err)
      return response.status(500).json(err)
    })
  }
  async create(request: Request, response: Response) {
    const { key, packages } = request.body
    const storeId = request.user.id;
    
    await connect.then(async (connection) => {
      const storesRepository = connection.getCustomRepository(StoresRepository);
      
      const store = await storesRepository.findOne(storeId);
      if (!store) {
        response.status(404)
        return response.json({ message: "Store not found" })
      }
      await connection.transaction(async (transactionManager) => {
        const deliversRepository = transactionManager.getCustomRepository(DeliversRepository);
        const packagesRepository = transactionManager.getCustomRepository(PackagesRepository);
        
        const deliver = await deliversRepository.create({ key, amount: packages.length, store: store })
        packages.map(async ({ latitude, longitude, product }: { latitude: number, longitude: number, product: string }) => {
          const pack = await packagesRepository.create({ product, longitude, latitude, deliver })
          return pack
        })
      })
      const deliversRepository = connection.getCustomRepository(DeliversRepository);
      const packagesRepository = connection.getCustomRepository(PackagesRepository);
      const deliver = await deliversRepository.findOne({ key, store });
      const packs = await packagesRepository.find(deliver)

      response.status(201)
      return response.json({ deliver, packages: packs })
    }).catch((err) => {
      console.log(err)
      return response.status(500).json(err)
    })
  }
}

export default DeliverController;