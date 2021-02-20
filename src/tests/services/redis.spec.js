const redis = require('async-redis');
const dotenv = require('dotenv');
dotenv.config();

test('if redis is up and running', (done) => {
  const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL);
  expect(!!client).toBeTruthy();
  client.quit();
  done();
});