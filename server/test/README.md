# Server Testes

## Disclaimer

Gostaria de deixar bem claro que não sou expert, estou estudando enquanto faço esse projeto, então qualquer coisa que encontrar errado, pode notificar que estarei disposto a ouvir

## Tests

Pelo que entendi da documentação, o jest vai procurar arquivos do tipo .spec.ts, .spec.js, .test.ts, .spec.ts, e vai roda-los

No console, você poderá conferir todos os tipos de testes que fizer, e é interessante você separá-los na hora de escrevê-los, optei por fazer da seguinte forma:

```javascript
describe("Initial", ()=>{
    it("Should compare 2 and 1+1", (done)=>{
        ...})
})
describe("Store", () => {
    it("Should save a store",(done)=>{
        ...})
    iit("Should login a store",(done)=>{
        ...
    })
})

describe('Driver', () => {
    it("Should login a Driver", (done)=>{
        ...})
    it("Should save a new Driver",(done)=>{
        ...})
})

describe('Deliver', () => {
    it("Should save a deliver", (done)=>{
        ...})
    it("Should return a deliver by store",(done)=>{
        ...})
    it("Should return a deliver by driver",(done)=>{
        ...})
    it("Should return all delivers",(done)=>{
        ...})
})
```
Como podem ver, o describe() vai mostrar um escopo de testes (como Store por exemplo), e o it vai ser o teste realmente, onde a mensagem de descrição vai dizer que o teste deveria fazer.

E no console vou ter a seguinte imagem

![](/RdmeAssets/JestConsole1.png)

Como estou fazendo teste de uma API, vou usar o supertest que foi instalado anteriormente, não vou mostrar todos os testes, mas o funcionamento dele vai ser mais ou menos assim:

```javascript
...
it("Should return success", async (done)=>{
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
...
```
Cada teste desse recebe 2 parâmetros, a descrição (que já falei antes) e um função de callback que pode mandar ou não como parâmetro a função de conclusão (chamei de done()), essa função deve ser chamada quando o teste terminar.

Como é uma simulação de requisição http, ele vai utilizar o async/await.

O supertest recebe como parâmetro um express() (foi chamado de app no arquivo app.ts), esse app tem as informações de como o servidor vai funcionar.

O supertest(app) tem várias funções que vão ser comuns no dia a dia, como as post(), get(), delete(), update(), send(), e vão servir para eu poder manipular essa requisição.

No exemplo àcima, se eu fiz corretamente, ele vai setar um header "Authorization" e vai mandar a informação de key através do caminho '/getdeliver',