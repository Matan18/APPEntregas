import { Request, Response } from "express";

import CreateDriverService from "../../../services/CreateDriverService";
import ListAllDriversFromStoreService from "../../../../drivers/services/ListAllDriversFromStoreService";


class DriverController {
  async create(request: Request, response: Response) {
    const { name, password } = request.body;
    const storeId = request.user.id;

    const createDriver = new CreateDriverService();
    const { driver } = await createDriver.execute({ name, password, storeId });

    response.status(201)
    return response.json({ driver });
  }
  async index(request: Request, response: Response) {
    const storeId = request.user.id;

    const listAllDrivers = new ListAllDriversFromStoreService();
    const { drivers } = await listAllDrivers.execute({ storeId });

    response.status(200);
    return response.json({ drivers })
  }
}

export default DriverController;