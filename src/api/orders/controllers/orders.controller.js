/**
 * @author Anuj Tomar 
 * @description this is a RCS controller file has method to Manage RCS Services
 */
const { handleSuccessNew, handleFailureNew } = require('../../../utils/helpers.js');
const { toast, user, global } = require('../../../utils/errorMessages.js');
const Order = require('../../../model/orders.model.js');
const { USERTYPE } = require('../../../utils/constants.js');

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.addOrder = async (req, res) => {
  try {
    const { userId, parentTree, userType } = req.userInfo;
    const { orderName } = req.validatedParams;
    req.validatedParams.parentId = userId;
    const orderExist = await Order.getOrderByCondition({ orderName });
    if (orderExist) throw new Error([400, toast.alreadyExist(orderName)]);
    if(userType == USERTYPE?.SUPERVISOR?.title) throw new Error([400, "Permission Denied!!!"]);
    parentTree.push(userId);
    req.validatedParams.parentTree = parentTree;
    const order = await Order.createOrder(req.validatedParams);
    handleSuccessNew(req, res, { "OrderID" : order?.orderId, "Order Name" : order?.orderName}, 'Order Created Successfully');
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getOrderData = async (req, res) => {
  try {
    const { orderId } = req.validatedParams;
    const userId = req?.userInfo?.userId;
    const orderDetails = await Order.getOrderDetails({ parentTree: userId, orderId });
    const message = (orderDetails) ? user.commonSuccess : user.notFound;
    handleSuccessNew(req, res, orderDetails, message);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.updateOrderData = async (req, res) => {
  try {
    const { orderId , doctorId} = req.validatedParams;
    const userId = req?.userInfo?.userId;
    const orderData = await Order.updateOrder({ parentTree: userId, orderId }, req.validatedParams);
    const message = (orderData?.nModified) ? user.updateSuccess : user.notFound;
    handleSuccessNew(req, res, { nModified: orderData?.nModified }, message);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.deleteOrderData = async (req, res) => {
  try {
    const { orderId } = req.validatedParams;
    const userId = req?.userInfo?.userId;
    const record = await Order.deleteOrder({ parentTree: userId, orderId });
    const message = (record?.deletedCount) ? user.commonSuccess : user.notFound;
    handleSuccessNew(req, res, record, message);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

