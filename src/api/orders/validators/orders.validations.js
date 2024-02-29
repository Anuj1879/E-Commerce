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
module.exports.order = async (req, res, next) => {
  const payload = {
    orderName: Joi.string().required().trim().error(new Error(user.orderName)),
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
module.exports.updateOrderData = async (req, res, next) => {
  const payload = Joi.object().keys({
    orderId: Joi.string().required().trim().error(new Error(user.orderId)),
    orderName: Joi.string().optional().trim().error(new Error(user.orderName)),
    status: Joi.string().optional().trim().error(new Error(user.status)),
  });
  try {
    req.validatedParams = await validate(req, payload);
    next();
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};
