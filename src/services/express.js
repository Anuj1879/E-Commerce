/**
 * @author Anuj Tomar
 * @description this file has to configure all routes, setup PORT and start listner.
 */
const config = require('../config');
const express = require('express');
const https = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('../middlewares/errorHandlers.js');
const connectToDb = require('../utils/dbConnect');
const initiateRoutes = require('../api');
const setupSocket = require('./socket.js');
const path = require('path');
const fs = require('fs');
const appRoot = require('app-root-path');
const superSeeds = require('./superAdmin.seeds');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));
app.use('/health', (req, res) => {
  res.status(200).send('OK');
});
const router = express.Router();
initiateRoutes(router);
app.use('/api/v1', router);
app.use(errorHandler.handleNotFound);
app.use(errorHandler.handleError);
// app.use(handleMulterErrors);

/**
 * @description Server start
 */
exports.start = async () => {
  const stat = await connectToDb();
  if (stat) {
    try {
      await superSeeds.createSuperAdmin();
        // eslint-disable-next-line
      const privateKeyPath = path.resolve(__dirname, './privkey.pem');
        // eslint-disable-next-line
      const certificatePath = path.resolve(__dirname, './fullchain.pem');
      const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
      const certificate = fs.readFileSync(certificatePath, 'utf8');
      const credentials = { key: privateKey, cert: certificate };

      const httpsServer = https.createServer(credentials, app);
      httpsServer.listen(config.httpPort, () => {
        console.log(`HTTP/HTTPS server running on port ${config.httpPort}`);
      });
      const ioHttps = socketIo(httpsServer, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          credentials: true
        }
      });
      setupSocket(ioHttps);
    } catch (error) {
      console.warn('HTTPS server setup failed. Check SSL files.', error);
    }
  }
};

exports.app = app;