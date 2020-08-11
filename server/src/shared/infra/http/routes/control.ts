import express from "express";

import DeliverController from "../../../../modules/delivers/infra/http/controllers/DeliverController";
import DriverController from "../../../../modules/drivers/infra/http/controllers/DriverController";
import StoreController from "../../../../modules/stores/infra/http/controllers/StoreController";
import ensureAuthenticated from "../middleware/ensureAuthenticated";

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

export default app;