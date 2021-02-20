const express = require('express');
const WeatherController = require('./controllers/WeatherController');

const routes = express.Router();

routes.get('/weather', WeatherController.index);
routes.get('/weather/:city', WeatherController.getByCity);

module.exports = routes;