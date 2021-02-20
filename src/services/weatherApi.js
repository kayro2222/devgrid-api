const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const BASE_URL = process.env.WEATHER_API_URL;

const weatherApi = axios.create({
    baseURL: BASE_URL,
});

weatherApi.defaults.params = {}
weatherApi.defaults.params['appid'] = process.env.WEATHER_API_KEY;
weatherApi.defaults.params['units'] = 'metric';

module.exports = weatherApi;