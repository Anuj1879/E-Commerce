const { verifyToken } = require('../utils/helpers.js');
const { toast } = require('../utils/errorMessages.js');
const User = require('../model/user.model.js');
s
/**
 * @author Suharsh Tyagi
 * @description This function acts as a middleware to check for JWT token, for all socket connections
 */
exports.authorizeSocket = async (socket, next) => {
  const token = socket.handshake.query.token; // Assuming the token is passed as a query parameter
  if (!token) {
    return next(new Error(toast.tokenRequired));  // If there's no token, return an error
  }

  try {
    const verifiedToken = await verifyToken(token);
    const userCheck = await User.getUserByCondition({ userId: verifiedToken?.userId });

    if (!userCheck) {
      throw new Error(toast.invalidToken);
    }

    // Save the user info to the socket object for future use
    socket.userInfo = verifiedToken;
    next();
  } catch (error) {
    return next(new Error(toast.invalidToken));
  }
};