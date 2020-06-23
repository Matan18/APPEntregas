import express from "express";

import connect from "./database/connections";
import StoresRepository from "./database/repositories/StoresRepository";
import DriversRepository from "./database/repositories/DriversRepository";
import DeliversRepository from "./database/repositories/DeliversRepository";
import PackagesRepository from "./database/repositories/PackagesRepository";

const app = express();
app.use(express.json())
app.get('/test', (req, res) => {
  console.log("Access")
  res.send({ message: "success" })
})


app.post('/register', async (request, response) => {
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
})

app.post('/login', (request, response) => {
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

})

app.post('/newdriver', async (request, response) => {
  const { name, password } = request.body;
  const storeId = request.headers.authorization;
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
})

app.get('/alldrivers', async (request, response) => {
  const storeId = request.headers.authorization;
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

})

app.post('/newdeliver', async (request, response) => {
  const { key, packages } = request.body
  const storeId = request.headers.authorization;
  
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
})
app.get('/getdeliver/:key', async (request, response) => {
  connect.then(async (connection) => {
    const storeId = request.headers.authorization;
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
})
app.get('/getdeliver', async (request, response) => {
  connect.then(async (connection) => {

    const { key } = request.query;
    const driverId = request.headers.authorization;
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
})

app.get('/alldelivers', async (request, response) => {
  const storeId = request.headers.authorization;
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
})
export default app;