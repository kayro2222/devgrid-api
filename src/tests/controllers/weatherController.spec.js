
const request = require("supertest");
const express = require('express');
const cors = require('cors');
const client = require('../../services/redis');
const routes = require('../../routes');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
const server = app.listen(3334);

afterAll(() => {
  client.flushall('ASYNC');
  server.close();
});


describe('routes', () => {
  test('GET /weather', async () => {
    const response = await request(server).get('/weather');
    
    expect(response.status).toBe(200);
  });

  test('GET /weather/:city', async () => {
    const { status, body } = await request(server).get('/weather/natal');
    
    expect(status === 200 || status === 202).toBeTruthy();
  });
});

describe('api returns', () => {
  test('cache five cities', async () => {
    await request(server).get('/weather/natal');
    await request(server).get('/weather/sao paulo');
    await request(server).get('/weather/londres');
    await request(server).get('/weather/rio de janeiro');
    const { body } = await request(server).get('/weather/salvador');

    expect(body.length).toBe(5);
  });

  test('data from GET /weather with max_number=1', async () => {
    await request(server).get('/weather/natal');

    const { body } = await request(server).get('/weather?max_number=1');
    
    expect(body.length).toBe(1);
  });

  test('data from GET /weather with max_number=2', async () => {
    await request(server).get('/weather/natal');
    await request(server).get('/weather/sao paulo');

    const { body } = await request(server).get('/weather?max_number=2');
    
    expect(body.length).toBe(2);
  });

  test('data from GET /weather with max_number=3', async () => {
    await request(server).get('/weather/natal');
    await request(server).get('/weather/sao paulo');
    await request(server).get('/weather/londres');

    const { body } = await request(server).get('/weather?max_number=3');
    
    expect(body.length).toBe(3);
  });

  test('data from GET /weather with max_number=4', async () => {
    await request(server).get('/weather/natal');
    await request(server).get('/weather/sao paulo');
    await request(server).get('/weather/londres');
    await request(server).get('/weather/rio de janeiro');

    const { body } = await request(server).get('/weather?max_number=4');
    
    expect(body.length).toBe(4);
  });

  test('data from GET /weather with max_number=5', async () => {
    await request(server).get('/weather/natal');
    await request(server).get('/weather/sao paulo');
    await request(server).get('/weather/londres');
    await request(server).get('/weather/rio de janeiro');
    await request(server).get('/weather/salvador');

    const { body } = await request(server).get('/weather?max_number=5');
    
    expect(body.length).toBe(5);
  });

  test('try to cache 6 cities with 2 equals cities', async () => {
    await request(server).get('/weather/natal');
    await request(server).get('/weather/sao paulo');
    await request(server).get('/weather/londres');
    await request(server).get('/weather/rio de janeiro');
    await request(server).get('/weather/salvador');
    const { body } = await request(server).get('/weather/natal');
    
    expect(body.length).toBe(5);
  });

  test('try to cache 6 different cities', async () => {
    await request(server).get('/weather/natal');
    await request(server).get('/weather/sao paulo');
    await request(server).get('/weather/londres');
    await request(server).get('/weather/rio de janeiro');
    await request(server).get('/weather/salvador');
    const { body } = await request(server).get('/weather/roma');

    const checkArrayRedimension = !!body.find((weather) => weather.name === "natal");
    
    expect(body.length === 5 && !checkArrayRedimension).toBeTruthy();
  });
})