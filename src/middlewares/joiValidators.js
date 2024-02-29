const Joi = require('joi');
const _ = require('lodash');

/**
 * @description This function has method related to Api Key Sms Payload Validations
 * @param {object} req HttpRequest Object
 * @param {object} payload HttpResponse Object
 */
module.exports.validate = async (req, payload) => {
  const requestData = _.merge(req.params, req.query, req.body);
  if (Object.keys(requestData).length == 0) throw new Error([400, 'Payload is blank']);
  const result = Joi.validate(requestData, payload);
  if (result.error) throw result.error;
  return result?.value;
};