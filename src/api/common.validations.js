/**
 * @author Anuj Tomar
 * @description this file has method to validate payload for RCS Related request
 */
const Joi = require('joi');
const { handleFailureNew } = require('../utils/helpers');
const { global } = require('../utils/helpers');
const { validate } = require('../middlewares/joiValidators');

/**
 * @description This function has method related to Api Key Sms Payload Validations
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 * @param {any} next called for next available route
 */
module.exports.productIdPayload = async (req, res, next) => {
  const payload = Joi.object().keys({
    productId: Joi.string().required().trim()
  });
  try {
    req.validatedParams = await validate(req, payload);
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
module.exports.paginationPayload = async (req, res, next) => {
  const payload = Joi.object().keys({
    searching: Joi.string().allow("").trim().error(new Error(global.searching)),
    userId: Joi.string().optional().trim(),
    userType: Joi.string().optional().trim(),
    batchId: Joi.string().optional().trim(),
    doctorId: Joi.string().optional().trim(),
    elle: Joi.object({
      sorting: Joi.object().allow({}).error(new Error(global.sorting)),
      start: Joi.number().required().error(new Error(global.start)),
      length: Joi.number().required().error(new Error(global.length)),
    }).required().error(new Error(global.elle))
  });
  try {
    req.validatedParams = await validate(req, payload);
    next();
  } catch (error) {
    console.log(error);
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to Api Key Sms Payload Validations
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 * @param {any} next called for next available route
 */
module.exports.paginationPayload2 = async (req, res, next) => {
  const payload = Joi.object().keys({
    searching: Joi.string().allow("").trim().error(new Error(global.searching)),
    patientId: Joi.string().required().trim(),
    elle: Joi.object({
      sorting: Joi.object().allow({}).error(new Error(global.sorting)),
      start: Joi.number().required().error(new Error(global.start)),
      length: Joi.number().required().error(new Error(global.length)),
    }).required().error(new Error(global.elle))
  });
  try {
    req.validatedParams = await validate(req, payload);
    next();
  } catch (error) {
    console.log(error);
    handleFailureNew(req, res, error);
  }
};

/**
* @description This function has method related to Api Key Sms Payload Validations
* @param {object} req HttpRequest Object
* @param {object} res HttpResponse Object
* @param {any} next called for next available route
*/
module.exports.userIdPayload = async (req, res, next) => {
  const payload = Joi.object().keys({
    userId: Joi.string().required().trim()
  });
  try {
    req.validatedParams = await validate(req, payload);
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
module.exports.batchIdPayload = async (req, res, next) => {
  const payload = Joi.object().keys({
    batchId: Joi.string().required().trim()
  });
  try {
    req.validatedParams = await validate(req, payload);
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
module.exports.orderIdPayload = async (req, res, next) => {
  const payload = Joi.object().keys({
    orderId: Joi.string().required().trim()
  });
  try {
    req.validatedParams = await validate(req, payload);
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
module.exports.userIdPayloadOptional = async (req, res, next) => {
  const payload = Joi.object().keys({
    userId: Joi.string().required().trim(),
    anyId: Joi.string().required().trim(),
  });
  try {
    req.validatedParams = await validate(req, payload);
    next();
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};
