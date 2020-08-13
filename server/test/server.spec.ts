import supertest from "supertest";
import app from "../src/shared/infra/http/routes/control";
import createConnection from "../src/shared/infra/typeorm/database/connections";
import { Connection, getConnection } from "typeorm";

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
    connection = await createConnection();

    await connection.query('drop table if exists packages;');
    await connection.query('drop table if exists delivers;');
    await connection.query('drop table if exists drivers;');
    await connection.query('drop table if exists stores;');
    await connection.query('drop table if exists migrations;');

    await connection.runMigrations();
  })
  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.query('drop table if exists packages;');
    await connection.query('drop table if exists delivers;');
    await connection.query('drop table if exists drivers;');
    await connection.query('drop table if exists stores;');
    await connection.query('drop table if exists migrations;');

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

    await connection.query('drop table if exists packages;');
    await connection.query('drop table if exists delivers;');
    await connection.query('drop table if exists drivers;');
    await connection.query('drop table if exists stores;');
    await connection.query('drop table if exists migrations;');

    await connection.close();
    await mainConnection.close();
  })
  it("should be able to register a store", async (done) => {
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
  it("should be able login a store", async (done) => {
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
      })
    done();
  })
  it("should not be able to login a Store with invalid credentials", async (done) => {
    await supertest(app)
      .post('/login')
      .send({ name: data.Store.name, password: "invalid password" })
      .set('Accept', 'application/json')
      .expect((response) => {
        expect(response.status).toEqual(401)
      })
    await supertest(app)
      .post('/login')
      .send({ name: 'invalid name', password: data.Store.password })
      .set('Accept', 'application/json')
      .expect((response) => {
        expect(response.status).toEqual(401)
      })
    await supertest(app)
      .post('/login')
      .send({ name: 'invalid name', password: 'invalid password' })
      .set('Accept', 'application/json')
      .expect((response) => {
        expect(response.status).toEqual(401)
      })
    done();
  })
})
describe('Driver', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    await supertest(app)
      .post('/register')
      .send({ ...data.Store, ...data.Driver })
      .set('Accept', 'application/json')
  })
  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.query('drop table if exists packages;');
    await connection.query('drop table if exists delivers;');
    await connection.query('drop table if exists drivers;');
    await connection.query('drop table if exists stores;');
    await connection.query('drop table if exists migrations;');

    await connection.close();
    await mainConnection.close();
  })
  it("should to able to login a Driver", async (done) => {
    await supertest(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ name: data.Driver.user, password: data.Driver.userPassword })
      .expect((response) => {
        expect(response.body.driver).toMatchObject({
          name: data.Driver.user,
        })
        expect(response.body).toHaveProperty('token');
      })
    done();
  })
  it("Should not be able to login a Driver with invalid credentials", async (done) => {
    await supertest(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ name: data.Driver.user, password: "invalid password" })
      .expect((response) => {
        expect(response.status).toEqual(401)
      })
    await supertest(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ name: "invalid name", password: data.Driver.userPassword })
      .expect((response) => {
        expect(response.status).toEqual(401)
      })
    await supertest(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ name: "invalid name", password: 'invalid password' })
      .expect((response) => {
        expect(response.status).toEqual(401)
      })
    done();
  })
  it("should be able to register a new Driver by a Store", async (done) => {
    const firstResponse = await supertest(app)
      .post('/login')
      .send({ name: data.Store.name, password: data.Store.password })
      .set('Accept', 'application/json');
    const storeId = `Baerer ${firstResponse.body.token}`;

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
  it("Should be able to return a list of Drivers from a Store", async (done) => {
    const firstResponse = await supertest(app)
      .post('/login')
      .send({ name: data.Store.name, password: data.Store.password })
      .set('Accept', 'application/json');

    const storeId = `Baerer ${firstResponse.body.token}`;

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
    await connection.runMigrations();

    await supertest(app)
      .post('/register')
      .send({ ...data.Store, ...data.Driver })
      .set('Accept', 'application/json')
  })
  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.query('drop table if exists packages;');
    await connection.query('drop table if exists delivers;');
    await connection.query('drop table if exists drivers;');
    await connection.query('drop table if exists stores;');
    await connection.query('drop table if exists migrations;');

    await connection.close();
    await mainConnection.close();
  })
  it("should be able to register a deliver", async (done) => {
    const firstResponse = await supertest(app)
      .post('/login')
      .send({ name: data.Store.name, password: data.Store.password })
      .set('Accept', 'application/json');
    const storeId = `Baerer ${firstResponse.body.token}`;
    await supertest(app)
      .post('/newdeliver')
      .set("Authorization", storeId)
      .send(data.Deliver)
      .expect((response) => {
        expect(response.body.deliver).toHaveProperty("id")
        expect(response.body.deliver).toHaveProperty("key")
        expect(response.body.deliver).toHaveProperty("amount")
        expect(response.body.deliver).toHaveProperty("packages")
        expect(response.body.deliver.packages).toHaveLength(data.Deliver.packages.length)
        expect(response.body.deliver.packages[0]).toHaveProperty('latitude')
        expect(response.body.deliver.packages[0]).toHaveProperty('longitude')
        expect(response.body.deliver.packages[0]).toHaveProperty('product')

      })
    done();
  })
  it("Should not be able to save a deliver with invalid token", async (done) => {
    await supertest(app)
      .post('/newdeliver')
      .set("Authorization", "invalid token")
      .send(data.Deliver)
      .expect((response) => {
        expect(response.status).toEqual(401);
      })
    done();
  })
  it("Should not be able to save a deliver with invalid id", async (done) => {
    const firstResponse = await supertest(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ name: data.Driver.user, password: data.Driver.userPassword })
    const driverId = `Baerer ${firstResponse.body.token}`;
    await supertest(app)
      .post('/newdeliver')
      .set("Authorization", driverId)
      .send(data.Deliver)
      .expect((response) => {
        expect(response.status).toEqual(403);
      })
    done();
  })
  it("should be able to return a deliver by store", async (done) => {
    const firstResponse = await supertest(app)
      .post('/login')
      .send({ name: data.Store.name, password: data.Store.password })
      .set('Accept', 'application/json');
    const storeId = `Baerer ${firstResponse.body.token}`;
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
  it("should be able to return a deliver by driver", async (done) => {
    const secondResponse = await supertest(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ name: data.Driver.user, password: data.Driver.userPassword })
    const driverId = `Baerer ${secondResponse.body.token}`;
    await supertest(app)
      .get(`/getdeliver`)
      .set("Authorization", driverId)
      .query({ key: data.Deliver.key })
      .expect((response) => {
        expect(response.body.deliver).toHaveProperty("id")
        expect(response.body.deliver).toHaveProperty("key")
        expect(response.body.deliver).toHaveProperty("amount")
        expect(response.body.deliver).toHaveProperty("packages")
        expect(response.body.deliver.packages).toHaveLength(data.Deliver.packages.length)
        expect(response.body.deliver.packages[0]).toHaveProperty('latitude')
        expect(response.body.deliver.packages[0]).toHaveProperty('longitude')
        expect(response.body.deliver.packages[0]).toHaveProperty('product')
      })
    done();
  })
  it("should be able to return all delivers", async (done) => {
    const firstResponse = await supertest(app)
      .post('/login')
      .send({ name: data.Store.name, password: data.Store.password })
      .set('Accept', 'application/json');
    const storeId = `Baerer ${firstResponse.body.token}`;

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