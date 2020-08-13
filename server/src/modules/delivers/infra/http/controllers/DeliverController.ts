import { Request, Response } from "express";

import CreateDeliverService from "../../../services/CreateDeliverService";
import SearchDeliverByStoreService from "../../../services/SearchDeliverByStoreService";
import ListAllDeliversService from "../../../../delivers/services/ListAllDeliversService";
import SearchDeliverByDriverService from "../../../../delivers/services/SearchDeliverByDriverService";

class DeliverController {
  async create(request: Request, response: Response) {
    const { key, packages } = request.body
    const storeId = request.user.id;

    const createDeliver = new CreateDeliverService();
    const { deliver } = await createDeliver.execute({ storeId, key, packages });

    response.status(201)
    return response.json({ deliver })
  }
  async index(request: Request, response: Response) {
    const storeId = request.user.id;

    const listAllDelivers = new ListAllDeliversService();
    const { delivers } = await listAllDelivers.execute({ storeId });

    response.status(200)
    return response.json({ delivers })
  }
  async searchParams(request: Request, response: Response) {
    const storeId = request.user.id;
    const { key } = request.params;

    const searchFromStore = new SearchDeliverByStoreService();
    const { deliver } = await searchFromStore.execute({ storeId, key });

    response.status(200)
    return response.json({ deliver })
  }
  async searchQuery(request: Request, response: Response) {
    const { key } = request.query;
    const driverId = request.user.id;

    const searchFromDriver = new SearchDeliverByDriverService();
    const { deliver } = await searchFromDriver.execute({ driverId, key: key.toString() });

    response.status(200)
    return response.json({ deliver })
  }
}

export default DeliverController;