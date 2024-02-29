const users = require('./users/routes');
const orders = require('./orders/routes');
const products = require('./products/routes');

/**
 * @description router
 */
const initiateRoutes = (router) => {
  users(router);
  orders(router);
  products(router);
};

module.exports = initiateRoutes;