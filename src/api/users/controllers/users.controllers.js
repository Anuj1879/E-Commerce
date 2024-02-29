/**
 * @author Anuj Tomar
 * @description this is a RCS controller file has method to Manage RCS Services
 */
const { toast, user, global } = require('../../../utils/errorMessages.js');
const { Encryption } = require('../../../utils/encryption.js');
const Users = require('../../../model/user.model.js');
const config = require('../../../config/index.js');
const { USERTYPE } = require('../../../utils/constants.js');
const { handleSuccessNew, handleFailureNew, generateToken, generateId, searchAlgorithm } = require('../../../utils/helpers.js');
// const { sendMail } = require('../../../../utils/email.service.js');

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.validatedParams;
    const userInfo = await Users.getLoginDetails({ email });
    if (!userInfo) throw new Error([400, toast.invalidUser]);
    if (!userInfo?.emailVerified) throw new Error([400, toast.emailNotVerified(email)]);
    const passwordHash = Encryption.encryptPassword(password, userInfo.userSalt);
    if (passwordHash !== userInfo.password) throw new Error([400, toast.invalidPassword]);
    const tokenPayload = { ip: req.ip, userId: userInfo.userId, userType: userInfo.userType, tokenId: generateId() };
    const token = await generateToken({ data: tokenPayload });
    await Users.updateToken({ userId: userInfo.userId }, { token });
    const response = {
      userType: userInfo.userType,
      email: userInfo.email,
      firstName: userInfo.firstName,
      middleName: userInfo.middleName,
      lastName: userInfo.lastName,
      emailVerified: userInfo.emailNotVerified,
      onboardingStatus: userInfo.onboardingStatus,
      termAndCondition: userInfo.termAndCondition,
      userId: userInfo.userId,
      token
    };
    if (!token) throw new Error([400, toast.expireToken]);
    handleSuccessNew(req, res, response, toast.loginSuccess(userInfo.firstName));
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.validatedParams;
    const userInfo = await Users.getLoginDetails({ email });
    if (!userInfo) throw new Error([400, toast.invaliEmail]);
    const message = toast.varificationCodeSentToEmail(email);
    const forgetPasswordToken = generateId();
    await Users.updateUser({ email }, { forgetPasswordToken });
    const verifyEmailLink = `${config.baseUrl}/forget-password?email=${email}&token=${forgetPasswordToken}`;
    const mailContent = `Hello ${userInfo?.firstName}!\n\nPlease click on the below link and to reset your password.\n${verifyEmailLink}\n \nThanks & Regards, \nMentorPedia`;
    sendMail(email, 'Verify your email', mailContent);
    handleSuccessNew(req, res, { verifyEmailLink }, message);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.userInfo;
    const { oldPassword, newPassword } = req.validatedParams;
    const userInfo = await Users.getLoginDetails({ userId });
    if (!userInfo) throw new Error([400, toast.invalidUser]);
    const passwordHash = Encryption.encryptPassword(oldPassword, userInfo.userSalt);
    if (passwordHash !== userInfo.password) throw new Error([400, toast.invalidPassword]);
    const encryptPassword = Encryption.encryptPassword(newPassword, userInfo?.userSalt);
    const updatePassword = await Users.updatePassword(userId, encryptPassword);
    handleSuccessNew(req, res, { nModified: updatePassword?.nModified }, toast.passwordChanged);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.updateForgetPassword = async (req, res) => {
  try {
    const { email, forgetPasswordToken, password } = req.validatedParams;
    const userInfo = await Users.getLoginDetails({ email, forgetPasswordToken });
    if (!userInfo) throw new Error([400, toast.invalidLink]);
    const encryptPassword = Encryption.encryptPassword(password, userInfo?.userSalt);
    const updatePassword = await Users.updatePassword(userInfo?.userId, encryptPassword);
    await Users.updateUser({ userId: userInfo?.userId }, { forgetPasswordToken: '' });
    handleSuccessNew(req, res, { nModified: updatePassword?.nModified }, toast.passwordChanged);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.logoutAll = async (req, res) => {
  try {
    const { userId } = req.userInfo;
    const response = await Users.logoutAll({ userId });
    handleSuccessNew(req, res, response);
  } catch (error) {
    console.log(error);
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.deleteAccount = async (req, res) => {
  try {
    const { userId } = req.userInfo;
    const response = await Users.deleteAccount({ userId });
    handleSuccessNew(req, res, { deletedCount: response?.deletedCount }, toast.deleteAccount);
  } catch (error) {
    console.log(error);
    handleFailureNew(req, res, error);
  }
};



/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.checkUsersExist = async (req, res) => {
  try {
    const { email } = req.validatedParams;
    const count = await Users.getUserExist({ email });
    if (count) throw new Error([400, toast.alreadyExist(email)]);
    handleSuccessNew(req, res, { count }, toast.available(email));
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.createUser = async (req, res) => {
  try {
    const { userId, firstName, lastName, userType, email, password } = req.validatedParams;
    const userExistCheck = await Users.getUserByCondition({ email });
    if (userExistCheck) throw new Error([400, toast.alreadyExist(email)]);
    const userSalt = Encryption.makeUserSalt(16);
    const encryptPassword = Encryption.encryptPassword(password, userSalt);
    const fullName = firstName.concat(" ", lastName);
    const payload = { userId, email, userSalt, password: encryptPassword, firstName, lastName, fullName, userType };
    payload.emailVerifiedToken = generateId();
    createdUser= await Users.createUser(payload);
    message= "User Successfully created"
    handleSuccessNew(req, res, createdUser, message);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getUserProfile = async (req, res) => {
  try {
    const uid = req?.validatedParams?.userId;
    const query = uid;
    const userDetails = await Users.getUserDetails(query);
    const message = (userDetails)?user.commonSuccess:user.notFound;
    handleSuccessNew(req, res, userDetails, message);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.userInfo;
    const uid = req?.validatedParams?.userId;
    const query = uid? { parentTree:userId, userId:uid } : { userId };
    const profileData = await Users.updateProfile(query, req.validatedParams);
    if (!profileData) throw new Error([400, user.notFound]);
    handleSuccessNew(req, res, { nModified: profileData?.nModified }, user.updateSuccess);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getUsersList = async (req,res) => {

  try {
    const { userId } = req.userInfo;
    const { elle, searching, userId:parentId, userType } = req.validatedParams;
    const search = searchAlgorithm({ users: Users }, searching);
    const query = { $and: [{ $or: search }], parentTree:userId, status: true };
    if(parentId) query.parentId = parentId;
    if(userType) query.userType = userType;
    const userData = await Users.getUsersList(query, elle);
    const message = (!userData)? global.noRecord: global.commonSuccess;
    handleSuccessNew(req, res, userData, message);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

  /**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.deleteUserProfile = async (req, res) => {
  try {
    const { userId } = req.userInfo;
    const uid = req?.validatedParams?.userId;
    const query = uid? { parentTree:userId, userId:uid } : { userId };
    const userDelete = await Users.deleteUser(query);
    const message = (userDelete)?user.commonSuccess:user.notFound;
    handleSuccessNew(req, res, userDelete, message);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

