require('dotenv').config();
const expressService = require('./services/express.js');
process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
});
expressService.start(true);
