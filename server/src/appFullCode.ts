import express from "express";
import connect from "./database/connections";
import { Store } from "./database/entity/Store";
import { Driver } from "./database/entity/Driver";
import { Deliver } from "./database/entity/Deliver";
import { Package } from "./database/entity/Package";
import { uuid } from "uuidv4";


const app = express();
app.use(express.json())
app.get('/test', (req, res) => {
  res.send({ message: "success" })
})

app.post('/register', (request, response) => {
  const { email, name, password, user, userPassword } = request.body
  connect.then(async (connection) => {
    let store = await connection.manager.findOne(Store, { where: { name, password } })
    if (!store) {
      const newStore = new Store()
      newStore.id = uuid()
      newStore.email = email
      newStore.name = name
      newStore.password = password

      await connection.manager.
        insert(Store, newStore)

      store = newStore;
    }
    let driver =

      await connection.manager.
        findOne(Driver,
          { where: { name: user, password: userPassword, store: store } })

    if (!driver) {
      const newDriver = new Driver()
      newDriver.id = uuid()
      newDriver.name = user
      newDriver.password = userPassword
      newDriver.store = store
      newDriver.delivers = []

      await connection.manager.
        insert(Driver, newDriver)

      driver = newDriver
    }
    response.status(201)
    return response.json({ store, driver })
  }).catch((err) => {
    console.log("Deu erro: ", err)
    return response.status(500).json(err)
  })
})

app.post('/login', (request, response) => {
  const { name, password } = request.body;
  connect.then(async (connection) => {

    const store =

      await connection.manager.
        findOne(Store,
          {
            where:
              [{ name, password },
              { email: name, password: password }]
          })

    if (!store) {
      const driver =

        await connection.manager.
          findOne(Driver, { where: { name, password } })

      if (!driver) {
        console.log("Deu erro: ")

        response.status(404)
        return response.send({ message: "Login not found" })
      }
      response.status(200)
      return response.json(driver)
    }
    response.status(200)
    return response.json(store)
  }).catch((err) => {
    console.log("Deu erro: ", err)
    return response.status(500).json(err)
  })
})

app.post('/newdriver', (request, response) => {
  const { name, password } = request.body;
  const storeId = request.headers.authorization;
  connect.then(async (connection) => {
    const store =

      await connection.manager.
        findOne(Store, storeId)

    if (!store) {
      response.status(404)
      return response.json({ message: "Store not found" })
    }
    let driver =

      await connection.manager.
        findOne(Driver,
          { where: { name, password, store: store } })

    if (driver) {

      response.status(200)
      return response.json({ driver })
    }
    const newDriver = new Driver()
    newDriver.id = uuid();
    newDriver.name = name;
    newDriver.password = password;
    newDriver.store = store;
    newDriver.delivers = []
    driver =

      await connection.manager.
        save(newDriver);

    response.status(201)
    return response.json({ driver });
  }).catch((err) => {
    console.log("Deu erro: ", err)
    return response.status(500).json(err)
  })
})

app.get('/alldrivers', (request, response) => {
  const storeId = request.headers.authorization;
  connect.then(async (connection) => {
    const store =

      await connection.manager.
        findOne(Store, storeId)


    if (!store) {
      response.status(404)
      return response.json({ message: "Store not found" })
    }
    const drivers =

      await connection.manager.
        find(Driver, { where: { store: storeId } })

    response.status(200)
    return response.json({ drivers })

  }).catch((err) => {
    console.log("Deu erro: ", err)
    return response.status(500).json(err)
  })
})

app.post('/newdeliver', (request, response) => {
  const { key, packages } = request.body
  const storeId = request.headers.authorization;
  connect.then(async (connection) => {
    const store =

      await connection.manager.
        findOne(Store, storeId)

    if (!store) {
      response.status(404)
      return response.json({ message: "Store not found" })
    }

    await connection.transaction(async (manager) => {
      let newDeliver = new Deliver()
      newDeliver.amount = packages.length
      newDeliver.key = key
      newDeliver.store = store

      newDeliver = await manager.save(newDeliver)

      packages.map(async (item) => {
        const pack = new Package()
        pack.latitude = item.latitude
        pack.longitude = item.longitude
        pack.product = item.product
        pack.deliver = newDeliver


        await manager.insert(Package, pack)
      });
      
      const deliver =
      await connection.manager.
      findOne(Deliver, { where: { key, store } })
      
      const packs =
      
      await connection.manager.
      find(Package, { where: { deliver: deliver } })
      
      response.status(201)
      return response.json({ deliver, packages: packs })
    })
  }).catch((err) => {
    console.log("Deu erro: ", err)
    return response.status(500).json(err)
  })
})
app.get('/getdeliver/:key', (request, response) => {
  const storeId = request.headers.authorization;
  const { key } = request.params;
  connect.then(async (connection) => {
    const store =

      await connection.manager.
        findOne(Store, storeId)

    if (!store) {
      const driver =

        await connection.manager.
          findOne(Driver, storeId)

      if (!driver) {
        response.status(404)
        return response.json({ message: "Id not found" })
      }
      const deliver =

        await connection.manager.
          findOne(Deliver,
            { where: { storeId: driver.store, key } })

      const packages = await connection.manager.find(Package, { where: { deliver: deliver } })

      if (!deliver) {
        response.status(404)
        return response.json({ message: "Deliver not fount" })
      }
      response.status(200)
      return response.json({ deliver, packages })
    }
    const deliver =

      await connection.manager.
        findOne(Deliver, { where: { store, key } })

    const packages = await connection.manager.find(Package, { where: { deliver } })

    if (!deliver) {
      response.status(404)
      return response.json({ message: "Deliver not fount" })
    }
    response.status(200)
    return response.json({ deliver, packages })
  }).catch((err) => {
    console.log("Deu erro: ", err)
    return response.status(500).json(err)
  })
})
app.get('/getdeliver', (request, response) => {
  const { key } = request.query;
  const driverId = request.headers.authorization;
  connect.then(async (connection) => {
    const driver =

      await connection.manager.
        findOne(Driver, driverId)

    if (!driver) {
      response.status(404)
      return response.json({ message: "Driver not found" })
    }
    const store =

      await connection.manager.
        findOne(Store,
          driver.store)

    const deliver =

      await connection.manager.
        findOne(Deliver,
          { select: ['id', 'key', 'amount'], where: { key, store: store } })

    const packages =

      await connection.manager.
        find(Package,
          { where: { deliver } })

    response.status(200)
    return response.json({ deliver, packages })
  }).catch((err) => {
    console.log("Deu erro: ", err)
    return response.status(500).json(err)
  })
})

app.get('/alldelivers', (request, response) => {
  const storeId = request.headers.authorization;
  connect.then(async (connection) => {
    const delivers =

      await connection.manager.
        find(Deliver, { where: { store:storeId } })

    response.status(200)
    return response.json({ delivers })
  }).catch((err) => {
    console.log("Deu erro: ", err)
    return response.status(500).json(err)
  })
})
export default app;