import { Request, Response } from "express";

import CreateStoreAndDriverService from "../../../../stores/services/CreateStoreAndDriverService";
import SessionService from "../../../../stores/services/SessionService";

class StoreController {
  async createAccount(request: Request, response: Response) {
    const { email, name, password, user, userPassword } = request.body

    const createAccountService = new CreateStoreAndDriverService();
    const { store, driver } = await createAccountService.execute({ email, name, password, user, userPassword });

    response.status(201)
    return response.json({ store, driver })
  }
  async session(request: Request, response: Response) {
    const { name, password } = request.body;

    const session = new SessionService();
    const { token, store, driver } = await session.execute({ name, password });

    response.status(200)
    return response.json({ token, store, driver })
  }
}

export default StoreController;