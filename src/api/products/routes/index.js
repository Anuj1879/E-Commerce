/**
 * @author Anuj Tomar
 * @description this file has to handle all middleware to validate payload, authenticate and controller related to Sms Services
 */
const productController = require('../controllers/products.controller');
const productValidator = require('../validators/products.validations');
const { authorize } = require('../../../middlewares/auth');
const commonValidator = require('../../../api/common.validations');

/**
 * @description hello
 * @param router
 */
module.exports = (router) => {
    router.post('/product', authorize, productValidator.product, productController.addProduct);
    router.get('/product/:productId', authorize, commonValidator.productIdPayload , productController.getProductData);
    router.put('/product', authorize, productValidator.updateProductData, productController.updateProductData);
    router.delete('/product/:productId', authorize, commonValidator.productIdPayload , productController.deleteProductData);
  };