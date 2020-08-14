import express, { Request, Response, NextFunction } from "express";
import 'express-async-errors';

import "../../../providers"
import DeliverController from "../../../../modules/delivers/infra/http/controllers/DeliverController";
import DriverController from "../../../../modules/drivers/infra/http/controllers/DriverController";
import StoreController from "../../../../modules/stores/infra/http/controllers/StoreController";
import ensureAuthenticated from "../middleware/ensureAuthenticated";
import AppError from "../../../errors/AppError";

const app = express();
app.use(express.json())

const deliverControler = new DeliverController();
const driverController = new DriverController();
const storeController = new StoreController();

app.post('/register', storeController.createAccount)
app.post('/login', storeController.session)


app.use(ensureAuthenticated);

app.post('/newdriver', driverController.create)
app.get('/alldrivers', driverController.index);


app.post('/newdeliver', deliverControler.create);
app.get('/getdeliver/:key', deliverControler.searchParams);
app.get('/getdeliver', deliverControler.searchQuery);
app.get('/alldelivers', deliverControler.index);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  console.log(err)
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export default app;