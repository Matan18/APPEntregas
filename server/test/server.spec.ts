import supertest from "supertest";
import app from "../src/shared/infra/http/routes/control";
import createConnection from "../src/shared/database/connections";
import { Connection, getConnection } from "typeorm";

let storeId = ""
let driverId = ""
let driverId2 = ""
const data = {
  Store: {
    email: "loja@test.com",
    name: "LojaTeste",
    password: "asdfghjkl",
  },
  Driver: {
    user: "Driver2",
    userPassword: "driverpass"
  },
  Deliver: {
    key: "chave",
    packages: [
      {
        product: "center",
        latitude: -25.6438383,
        longitude: -49.2942842
      },
      {
        product: "caixa",
        latitude: -25.645397,
        longitude: -49.302779
      },
      {
        product: "caixa2",
        latitude: -25.645890,
        longitude: -49.308090
      },
      {
        product: "caixa3",
        latitude: -25.649149,
        longitude: -49.306899
      }
    ]
  }
}
let connection: Connection
describe("Initial", () => {
  beforeAll(async () => {
    connection = await createConnection("test-connection");

    await connection.query('DROP TABLE IF EXISTS packages');
    await connection.query('DROP TABLE IF EXISTS delivers');
    await connection.query('DROP TABLE IF EXISTS drivers');
    await connection.query('DROP TABLE IF EXISTS stores');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  })
  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  })
})

describe("Store", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })
  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  })
  it("Should save a store", async (done) => {
    const response = await supertest(app)
      .post('/register')
      .send({ ...data.Store, ...data.Driver })
      .set('Accept', 'application/json')
    expect(response.body).toMatchObject({
      store: {
        email: data.Store.email,
        name: data.Store.name,
        id: response.body.store.id
      },
      driver: {
        name: data.Driver.user,
        id: response.body.driver.id
      }
    })
    done()
  })
  it("Should login a store", async (done) => {
    await supertest(app)
      .post('/login')
      .send({ name: data.Store.name, password: data.Store.password })
      .set('Accept', 'application/json')
      .expect((response) => {
        expect(response.body.store).toMatchObject({
          email: data.Store.email,
          name: data.Store.name,
        })
        expect(response.body).toHaveProperty('token');
        storeId = `Baerer ${response.body.token}`;
      })
    done();
  })
})
describe('Driver', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

  })
  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  })
  it("Should login a Driver", async (done) => {
    await supertest(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ name: data.Driver.user, password: data.Driver.userPassword })
      .expect((response) => {
        expect(response.body.driver).toMatchObject({
          name: data.Driver.user,
        })
        expect(response.body).toHaveProperty('token');
        driverId = `Baerer ${response.body.token}`;
      })
    done();
  })
  it("Should save a new Driver", async (done) => {
    await supertest(app)
      .post('/newdriver')
      .set("Authorization", storeId)
      .send({ name: "newDriver", password: "newpass" })
      .expect((response) => {
        expect(response.body.driver).toMatchObject({
          id: response.body.driver.id,
          name: "newDriver",
        });

      })
    done();
  })
  it("Should return a list of Drivers from a Store", async (done) => {
    await supertest(app)
      .get('/alldrivers')
      .set("Authorization", storeId)
      .expect((response) => {
        expect(response.body.drivers[0]).toHaveProperty("id")
        expect(response.body.drivers[0]).toHaveProperty("name")
        expect(response.body.drivers[1]).toHaveProperty("id")
        expect(response.body.drivers[1]).toHaveProperty("name")
      })
    done()
  })
})
describe('Deliver', () => {
  beforeAll(async () => {
    connection = await createConnection();

  })
  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  })
  it("Should save a deliver", async (done) => {
    await supertest(app)
      .post('/newdeliver')
      .set("Authorization", storeId)
      .send(data.Deliver)
      .expect((response) => {
        expect(response.body.deliver).toHaveProperty("id")
        expect(response.body.deliver).toHaveProperty("key")
        expect(response.body.deliver).toHaveProperty("amount")
        expect(response.body).toHaveProperty("packages")
        expect(response.body.packages).toHaveLength(data.Deliver.packages.length)
        expect(response.body.packages[0]).toHaveProperty('latitude')
        expect(response.body.packages[0]).toHaveProperty('longitude')
        expect(response.body.packages[0]).toHaveProperty('product')

      })
    done();
  })
  it("Should return a deliver by store", async (done) => {
    await supertest(app)
      .get(`/getdeliver/${data.Deliver.key}`)
      .set("Authorization", storeId)
      .expect((response) => {
        expect(response.body.deliver).toHaveProperty("id")
        expect(response.body.deliver).toHaveProperty("key")
        expect(response.body.deliver).toHaveProperty("amount")
      })
    done();
  })
  it("Should return a deliver by driver", async (done) => {
    await supertest(app)
      .get(`/getdeliver`)
      .set("Authorization", driverId)
      .query({ key: data.Deliver.key })
      .expect((response) => {
        expect(response.body.deliver).toHaveProperty("id")
        expect(response.body.deliver).toHaveProperty("key")
        expect(response.body.deliver).toHaveProperty("amount")
        expect(response.body).toHaveProperty("packages")
        expect(response.body.packages).toHaveLength(data.Deliver.packages.length)
        expect(response.body.packages[0]).toHaveProperty('latitude')
        expect(response.body.packages[0]).toHaveProperty('longitude')
        expect(response.body.packages[0]).toHaveProperty('product')
      })
    done();
  })
  it("Should return all delivers", async (done) => {
    await supertest(app)
      .get('/alldelivers')
      .set("Authorization", storeId)
      .expect((response) => {
        expect(response.body).toHaveProperty("delivers")
        expect(response.body.delivers[0]).toHaveProperty('id')
        expect(response.body.delivers[0]).toHaveProperty('key')
        expect(response.body.delivers[0]).toHaveProperty('amount')

      })
    done();
  })

})