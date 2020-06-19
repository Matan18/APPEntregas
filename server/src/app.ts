import express from "express";
import connect from "./database/connections";
import { Store } from "./database/entity/Store";
import { Driver } from "./database/entity/Driver";
import { Deliver } from "./database/entity/Deliver";
import { Package } from "./database/entity/Package";
import { uuid } from "uuidv4";
import { Connection } from "typeorm";


const app = express();
app.use(express.json())
app.get('/test', (req, res) => {
    console.log("Access")
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
            await connection.manager.insert(Store, newStore)
            store = newStore;
        }
        let driver = await connection.manager.findOne(Driver, { where: { name: user, password: userPassword } })
        if (!driver) {
            const newDriver = new Driver()
            newDriver.id = uuid()
            newDriver.name = user
            newDriver.password = userPassword
            newDriver.storeId = store
            await connection.manager.insert(Driver, newDriver)
            driver = newDriver
        }
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
        const store = await connection.manager.findOne(Store, { where: [{ name, password }, { email: name, password: password }] })
        if (!store) {
            const driver = await connection.manager.findOne(Driver, { where: { name, password } })
            if (!driver) {

                response.status(404)
                return response.send({ message: "Login not found" })
            }
            response.status(200)
            return response.json(driver)
        }
        response.status(200)
        return response.json(store)
    })
})

app.post('/newdriver', (request, response) => {
    const { name, password } = request.body;
    const storeId = request.headers.authorization;
    connect.then(async (connection) => {
        const store = await connection.manager.findOne(Store, storeId)
        if (!store) {
            response.status(404)
            return response.json({ message: "Store not found" })
        }
        let driver = await connection.manager.findOne(Driver, { where: { name, password, storeId: store } })
        if (driver) {

            response.status(200)
            return response.json({ driver })
        }
        const newDriver = new Driver()
        newDriver.id = uuid();
        newDriver.name = name;
        newDriver.password = password;
        newDriver.storeId = store;
        driver = await connection.manager.save(newDriver);
        response.status(201)
        return response.json({ driver });
    }).catch((err) => {
        return response.status(500).send(err)
    })
})

app.get('/alldrivers', (request, response) => {
    const storeId = request.headers.authorization;
    connect.then(async (connection) => {
        const store = await connection.manager.findOne(Store, storeId)
        if (!store) {
            response.status(404)
            return response.json({ message: "Store not found" })
        }
        const drivers = await connection.manager.find(Driver, { where: { storeId } })

        response.status(200)
        return response.json({ drivers })

    }).catch((err) => {
        return response.status(500).send(err)
    })
})

app.post('/newdeliver', (request, response) => {
    const { key, packages } = request.body
    const storeId = request.headers.authorization;
    connect.then(async (connection) => {
        const store = await connection.manager.findOne(Store, storeId)
        if (!store) {
            response.status(404)
            return response.json({ message: "Store not found" })
        }

        await connection.transaction(async (manager) => {
            const newDeliver = new Deliver()
            newDeliver.amount = packages.length
            newDeliver.key = key
            newDeliver.storeId = store
            await manager.save(newDeliver)

            packages.map(async (item) => {
                const pack = new Package()
                pack.latitude = item.latitude
                pack.longitude = item.longitude
                pack.product = item.product
                pack.deliverId = newDeliver
                await manager.save(pack)
            });
        })

        const deliver = await connection.manager.findOne(Deliver, { where: { key, storeId } })
        const packs = await connection.manager.find(Package, { where: { deliverId: deliver } })
        response.status(201)
        return response.json({ deliver, packages: packs })
    }).catch((err) => {
        return response.status(500).send(err)
    })
})
app.get('/getdeliver/:key', (request, response) => {
    const storeId = request.headers.authorization;
    const { key } = request.params;
    connect.then(async (connection) => {
        const store = await connection.manager.findOne(Store, storeId)
        if (!store) {
            const driver = await connection.manager.findOne(Driver, storeId)
            if (!driver) {
                response.status(404)
                return response.json({ message: "Id not found" })
            }
            const deliver = await connection.manager.findOne(Deliver, { where: { storeId: driver.storeId, key } })
            if (!deliver) {
                response.status(404)
                return response.json({ message: "Deliver not fount" })
            }
            console.log(deliver)
            response.status(200)
            return response.json({ deliver })
        }
        const deliver = await connection.manager.findOne(Deliver, { where: { storeId: storeId, key } })
        if (!deliver) {
            response.status(404)
            return response.json({ message: "Deliver not fount" })
        }
        response.status(200)
        return response.json({ deliver })
    }).catch((err) => {
        return response.status(500).json(err)
    })
})
app.get('/getdeliver', (request, response) => {
    const { key } = request.query;
    const driverId = request.headers.authorization;
    connect.then(async (connection) => {
        const driver = await connection.manager.findOne(Driver, driverId)
        if (!driver) {
            response.status(404)
            return response.json({ message: "Driver not found" })
        }
        const store = await connection.manager.findOne(Store, driver.storeId)
        const deliver = await connection.manager.findOne(Deliver, { where: { key, storeId:store } })
        const packages = await connection.manager.find(Package, { where: { deliverId: deliver } })
        response.status(200)
        return response.json({ deliver, packages })
    }).catch((err) => {
        return response.status(500).json(err)
    })
})

app.get('/alldelivers', (request, response) => {
    const storeId = request.headers.authorization;
    connect.then(async (connection) => {
        const delivers = await connection.manager.find(Deliver, { where: { storeId } })
        response.status(200)
        return response.json({ delivers })
    }).catch((err) => {

        return response.status(500).send(err)
    })
})
export default app;