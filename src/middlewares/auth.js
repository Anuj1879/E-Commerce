const { handleFailure, verifyToken } = require('../utils/helpers.js');
const { toast } = require('../utils/errorMessages.js');
const User = require('../model/user.model.js');

/**
 * @description This file has method related to authorization validation
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 * @param {any} next called for next available route
 */
exports.authorize = async (req, res, next) => {
  if (
    req.headers.authorization == undefined ||
    req.headers.authorization == ''
  ) {
    handleFailure(res, 401, toast.tokenRequired);
  } else {
    try {
      const token = await verifyToken(req.headers.authorization);
      const userCheck = await User.getUserByCondition({ userId: token?.userId, token: { $ne: '' } });
      if (!userCheck) throw new Error([401, toast.invalidToken]);
      const { parentId, parentTree } = userCheck;
      req.userInfo = { ...token, parentId, parentTree };
      next();
    } catch (error) {
      handleFailure(res, 401, toast.invalidToken);
    }
  }
};