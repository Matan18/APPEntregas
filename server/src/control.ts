import express from "express";
import 'dotenv';

import DeliverController from "./controllers/DeliverControler/DeliverController";
import DriverController from "./controllers/DriverController/DriverController";
import StoreController from "./controllers/StoreController/StoreController";
import ensureAuthenticated from "./middleware/ensureAuthenticated";

const app = express();
app.use(express.json())
app.get('/test', (req, res) => {
  console.log("Access")
  res.send({ message: "success" })
})

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