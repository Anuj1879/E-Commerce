/**
 * @author Anuj Tomar || Kabir Singh
 * @description this file has method to validate payload for RCS Related request
 */
const Joi = require('joi');
const { handleFailureNew } = require('../../../utils/helpers');
const { user } = require('../../../utils/errorMessages');
const { validate } = require('../../../middlewares/joiValidators');

/**
 * @description This function has method related to Api Key Sms Payload Validations
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 * @param {any} next called for next available route
 */
module.exports.product = async (req, res, next) => {
  const payload = {
    productName: Joi.string().required().trim().error(new Error(user.productName)),
    price: Joi.string().optional().trim().error(new Error(user.price)),
    status: Joi.string().optional().trim().error(new Error(user.status)),
  };
  try {
    req.validatedParams = await validate(req, Joi.object().keys(payload));
    next();
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to Api Key Sms Payload Validations
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 * @param {any} next called for next available route
 */
module.exports.updateProductData = async (req, res, next) => {
  const payload = Joi.object().keys({
    productId: Joi.string().required().trim().error(new Error(user.productId)),
    productName: Joi.string().optional().trim().error(new Error(user.productName)),
    price: Joi.string().optional().trim().error(new Error(user.price)),
    status: Joi.string().optional().trim().error(new Error(user.status)),
  });
  try {
    req.validatedParams = await validate(req, payload);
    next();
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};
