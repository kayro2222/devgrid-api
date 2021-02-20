const redis = require('async-redis');
const dotenv = require('dotenv');
dotenv.config();

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL);
 
client.on("error", function(err) {
  console.log('REDIS ERROR', err);
});

module.exports = client;