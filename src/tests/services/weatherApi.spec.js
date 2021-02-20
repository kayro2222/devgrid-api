const weatherApi = require('../../services/weatherApi');
const dotenv = require('dotenv');
dotenv.config();

test('if weather api connection is up', async () => {
  const connection = await weatherApi.get('/weather?q=natal').then((response) => {
    return response.status;
  }).catch((error) => {
    return error.response.status;
  });
  expect(connection).toBe(200);
});