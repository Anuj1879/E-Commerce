/**
 * @author Anuj Tomar
 * @description this file has method to validate payload for RCS Related request
 */
const Joi = require('joi');
const { handleFailureNew } = require('../../../utils/helpers.js');
const { user } = require('../../../utils/errorMessages.js');
const { validate } = require('../../../middlewares/joiValidators');
const { USERTYPE } = require('../../../utils/constants.js');

const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; 
const emailReg = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}|-?\d+(\.\d+)?)$/;

/**
 * @description This function has method related to Api Key Sms Payload Validations
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 * @param {any} next called for next available route
 */
module.exports.login = async (req, res, next) => {
    const payload = Joi.object().keys({
        email: Joi.string().regex(emailReg).required().trim().error(new Error(user.emailId)),
        password: Joi.string().regex(reg).required().trim().error(new Error(user.password)),
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
module.exports.forgetPassword = async (req, res, next) => {
    const payload = Joi.object().keys({
        email: Joi.string().regex(emailReg).required().trim().error(new Error(user.emailId)),
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
module.exports.updateForgetPassword = async (req, res, next) => {   
    const payload = Joi.object().keys({     
        email: Joi.string().regex(emailReg).required().trim().error(new Error(user.emailId)),
        forgetPasswordToken: Joi.string().required().trim(), 
        password: Joi.string().regex(reg).required().trim().error(new Error(user.password)),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().trim().error(new Error(user.rePassword)),
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
module.exports.changePassword = async (req, res, next) => {
    const payload = Joi.object().keys({
        oldPassword: Joi.string().required().trim().error(new Error(user.password)),
        newPassword: Joi.string().regex(reg).required().trim().error(new Error(user.password)),
        confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().trim().error(new Error(user.rePassword)),
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
module.exports.usersExist = async (req, res, next) => {
  const payload = Joi.object().keys({
    email: Joi.string().required().trim().error(new Error(user.emailId)),
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
module.exports.users = async (req, res, next) => {
  const payload = {
    firstName: Joi.string().required().trim().error(new Error(user.firstName)),
    lastName: Joi.string().required().trim().error(new Error(user.lastName)),
    email: Joi.string().regex(emailReg).required().trim().error(new Error(user.emailId)),
    password: Joi.string().regex(reg).required().trim().error(new Error(user.password)),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().trim().error(new Error(user.existPassword))
  };
  try {
    if(req?.userInfo){
      payload.userType = Joi.string().required().valid(Object.keys(USERTYPE).map(a=>a.toLowerCase())).trim().error(new Error('invalid user type'));
    }
    console.log("######################################")
    req.validatedParams = await validate(req, Joi.object().keys(payload));
    console.log(req.validatedParams);
    console.log("######################################")
    if(req?.userInfo){
      if(USERTYPE[req?.userInfo?.userType.toUpperCase()].priority >= USERTYPE[req?.validatedParams?.userType.toUpperCase()].priority){
        throw new Error([400, 'permission denied!']);
      }
    }
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
module.exports.updateUserProfile = async (req, res, next) => {
  // eslint-disable-next-line semi
  const payload = Joi.object().keys({
    userId: Joi.string().optional().trim().error(new Error(user.userId)),
    firstName: Joi.string().optional().trim().error(new Error(user.firstName)),
    middleName: Joi.string().optional().allow('').trim().error(new Error(user.middleName)),
    lastName: Joi.string().optional().trim().error(new Error(user.lastName)),
    language: Joi.array().unique().optional().error(new Error(user.language)),
    mobile: Joi.string().optional(),
    city: Joi.string().optional().trim().error(new Error(user.city)),
    country: Joi.string().optional().trim().error(new Error(user.country)),
    birthday: Joi.string().regex(reg).optional().trim().error(new Error(user.birthday))
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
module.exports.updateUser = async (req, res, next) => {
  const payload = Joi.object().keys({
    onboardingStatus: Joi.number().valid(1, 2).optional().error(new Error(user.onboardingStatus)),
    termAndCondition: Joi.boolean().optional().error(new Error(user.termAndCondition)),
    status: Joi.boolean().optional().error(new Error(user.status)),
  });
  try {
    req.validatedParams = await validate(req, payload);
    next();
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};


