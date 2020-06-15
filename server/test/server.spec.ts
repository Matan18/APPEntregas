import supertest from "supertest";
import app from "../src/app";

let storeId = ""
let driverId = ""
const data = {
    Loja: {
        email: "loja@test.com",
        name: "LojaTeste",
        password: "asdfghjkl",
    },
    Driver: {
        user: "Driver1",
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

describe("Initial", () => {
    it("Should return success", async (done) => {
        await supertest(app)
            .get('/test')
            .expect((response) => {
                expect(response.body).toHaveProperty('message')
                expect(response.body.message).toEqual('success')
            })
        done();
    })
})

describe("Store", () => {
    it("Should save a store", async (done) => {
        await supertest(app)
            .post('/register')
            .send({ ...data.Loja, ...data.Driver })
            .set('Accept', 'application/json')
            .expect((response) => {
                expect(response.body.loja).toHaveProperty('id');
                storeId = response.body.loja.id;
                expect(response.body.driver).toHaveProperty('id')
            })
        done()
    })
    it("Should login a store", async (done) => {
        await supertest(app)
            .post('/login')
            .send({ name: data.Loja.name, password: data.Loja.password })
            .set('Accept', 'application/json')
            .expect((response) => {
                expect(response.body.loja).toHaveProperty('id');
                expect(response.body.loja).toHaveProperty('email');
                expect(response.body.loja).toHaveProperty('name');
                expect(response.body.loja).toHaveProperty('password');
            })
        done();
    })
})
describe('Driver', () => {
    it("Should login a Driver", async (done) => {
        await supertest(app)
            .post('/login')
            .set('Accept', 'application/json')
            .send({ name: data.Driver.user, password: data.Driver.userPassword })
            .expect((response) => {
                expect(response.body.driver).toHaveProperty('id');

                expect(response.body.driver).toHaveProperty('name');
                expect(response.body.driver).toHaveProperty('store');
                expect(response.body.driver).toHaveProperty('password');
            })
        done();
    })
    it("Should save a new Driver", async (done) => {
        await supertest(app)
            .post('/newdriver')
            .set("Authorization", storeId)
            .send({ name: "newDriver", password: "newpass" })
            .expect((response) => {
                expect(response.body.driver).toHaveProperty('id');
                expect(response.body.driver).toHaveProperty('name');
                expect(response.body.driver).toHaveProperty('store');
                expect(response.body.driver).toHaveProperty('password');
            })
        done();
    })
})
describe('Deliver', () => {
    it("Should save a deliver", async (done) => {
        await supertest(app)
            .post('/newdeliver')
            .set("Authorization", storeId)
            .send(data.Deliver)
            .expect((response) => {
                expect(response.body.deliver).toHaveProperty('id');
                expect(response.body.deliver).toHaveProperty('key');
                expect(response.body.deliver).toHaveProperty('amount');
                expect(response.body.deliver).toHaveProperty('store');
                expect(response.body.deliver).toHaveProperty('packages');
            })
        done();
    })
    it("Should return a deliver by store", async (done) => {
        await supertest(app)
            .post('/getdeliver')
            .set("Authorization", storeId)
            .send({ key: data.Deliver.key })
            .expect((response) => {
                expect(response.body.deliver).toHaveProperty('id');
                expect(response.body.deliver).toHaveProperty('key');
                expect(response.body.deliver).toHaveProperty('amount');
                expect(response.body.deliver).toHaveProperty('store');
                expect(response.body.deliver).toHaveProperty('packages');
            })
        done();
    })
    it("Should return a deliver by driver", async (done) => {
        await supertest(app)
            .get('/getdeliver')
            .set("Authorization", driverId)
            .query({ key: data.Deliver.key })
            .expect((response) => {
                expect(response.body.deliver).toHaveProperty('id');
                expect(response.body.deliver).toHaveProperty('key');
                expect(response.body.deliver).toHaveProperty('amount');
                expect(response.body.deliver).toHaveProperty('store');
                expect(response.body.deliver).toHaveProperty('packages');
            })
        done();
    })
    it("Should return all delivers", async (done) => {
        await supertest(app)
            .get('/alldelivers').set("Authorization", storeId)
            .expect((response) => {
                expect(response.body).toHaveProperty("delivers")
            })
        done();
    })

})