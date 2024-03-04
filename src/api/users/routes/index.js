/**
 * @author Anuj Tomar
 * @description this file has to handle all middleware to validate payload, authenticate and controller related to Sms Services
 */
const { authorize } = require('../../../middlewares/auth');
const usersController = require('../controllers/users.controllers');
const usersValidator = require('../validators/users.validations');
const commonValidator = require('../../common.validations');

/**
 * @description hello
 * @param router
 */
module.exports = (router) => {
  router.post('/users', usersValidator.users, usersController.createUser);
  router.get('/user-profile/:userId', commonValidator.userIdPayload, usersController.getUserProfile);
  router.put('/user-profile', usersValidator.updateUserProfile, usersController.updateUserProfile);
  router.delete('/user/:userId', commonValidator.userIdPayload, usersController.deleteUserProfile);
  router.post('/login', usersValidator.login, usersController.login);
  router.post('/forget-password', usersValidator.forgetPassword, usersController.forgetPassword);
  router.put('/forget-password', usersValidator.updateForgetPassword, usersController.updateForgetPassword);
  router.put('/change-password', usersValidator.changePassword, usersController.changePassword);
  router.put('/logout-all', authorize, usersController.logoutAll);
};
