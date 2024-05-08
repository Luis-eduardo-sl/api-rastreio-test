const request = require('supertest')
const express = require('express')

const app = express();
const routes = require('../routes/deliveryRoutes')
app.use(express.json());
app.use('/deliveries', routes)

describe('/GET DELIVERY', () => {
const newDelivery = {
trackingNumber: '10',
status: 'preparando pedido'
}

beforeAll(async () => {
await request(app).post('/deliveries').send(newDelivery)
})

afterAll(async () => {
await request(app).delete(`/deliveries/${newDelivery.trackingNumber}`)
})

it('Deve retornar o delivery 10', async () => {
const response = await request(app).get(`/deliveries/${newDelivery.trackingNumber}`);
expect(response.statusCode).toBe(200)
expect(response.body.trackingNumber).toBe('10');
})

it('Deve retornar "Delivery not found"', async () => {
const response = await request(app).get(`/deliveries/0`);
expect(response.statusCode).toBe(404)
expect(response.body.error).toBe('Delivery not found');
})
});

describe('/POST DELIVERY', () => {
const newDelivery = {
trackingNumber: '10',
status: 'preparando pedido'
}

afterAll(async () => {
await request(app).delete(`/deliveries/${newDelivery.trackingNumber}`)
})

it('Deve retornar o objeto criado', async () => {
const response = await request(app).post('/deliveries').send(newDelivery)
expect(response.statusCode).toBe(200)
expect(response.body.trackingNumber).toBe(newDelivery.trackingNumber)
})

it('Deve retornar "Failed to create delivery"', async () => {
const response = await request(app).post('/deliveries').send('dados inválidos')
expect(response.statusCode).toBe(500)
expect(response.body.error).toBe('Failed to create delivery')
})
})

describe('/PUT DELIVERY', () => {
const newDelivery = {
trackingNumber: '10',
status: 'preparando pedido'
}

const newStatus = {
status: 'entregue'
}

beforeAll(async () => {
await request(app).post('/deliveries').send(newDelivery)
})

afterAll(async () => {
await request(app).delete(`/deliveries/${newDelivery.trackingNumber}`)
})

it('Deve retornar o objeto atualizado', async () => {
const response = await request(app).put(`/deliveries/${newDelivery.trackingNumber}`).send(newStatus)
expect(response.statusCode).toBe(200)
expect(response.body.status).toBe(newStatus.status)
})

it('Deve retornar "Delivery not found"', async () => {
const response = await request(app).put('/deliveries/0').send(newStatus.status)
expect(response.statusCode).toBe(404)
expect(response.body.error).toBe('Delivery not found')
})
})