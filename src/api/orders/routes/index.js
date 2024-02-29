/**
 * @author Anuj Tomar
 * @description this file has to handle all middleware to validate payload, authenticate and controller related to Sms Services
 */
const orderController = require('../controllers/orders.controller');
const orderValidator = require('../validators/orders.validations');
const { authorize } = require('../../../middlewares/auth');
const commonValidator = require('../../../api/common.validations');

/**
 * @description hello
 * @param router
 */
module.exports = (router) => {
    router.post('/order', authorize, orderValidator.order, orderController.addOrder);
    router.get('/order/:orderId', authorize, commonValidator.orderIdPayload , orderController.getOrderData);
    router.put('/order', authorize, orderValidator.updateOrderData, orderController.updateOrderData);
    router.delete('/order/:orderId', authorize, commonValidator.orderIdPayload , orderController.deleteOrderData);
  };