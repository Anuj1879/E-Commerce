/**
 * @author Anuj Tomar 
 * @description this is a RCS controller file has method to Manage RCS Services
 */
const { handleSuccessNew, handleFailureNew } = require('../../../utils/helpers.js');
const { toast, user, global } = require('../../../utils/helpers.js');
const Products = require('../../../model/products.model.js');
const { USERTYPE } = require('../../../utils/constants.js');

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.addProduct = async (req, res) => {
  try {
    const { userId, parentTree, userType } = req.userInfo;
    const { productName } = req.validatedParams;
    req.validatedParams.parentId = userId;
    const productExist = await Product.getProductByCondition({ productName });
    if (productExist) throw new Error([400, toast.alreadyExist(productName)]);
    if(userType == USERTYPE?.SUPERVISOR?.title) throw new Error([400, "Permission Denied!!!"]);
    parentTree.push(userId);
    req.validatedParams.parentTree = parentTree;
    const product = await Product.createProduct(req.validatedParams);
    handleSuccessNew(req, res, { "ProductID" : product?.productId, "Product Name" : product?.productName}, 'Product Created Successfully');
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getProductData = async (req, res) => {
  try {
    const { productId } = req.validatedParams;
    const userId = req?.userInfo?.userId;
    const productDetails = await Product.getProductDetails({ parentTree: userId, productId });
    const message = (productDetails) ? user.commonSuccess : user.notFound;
    handleSuccessNew(req, res, productDetails, message);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.updateProductData = async (req, res) => {
  try {
    const { productId , doctorId} = req.validatedParams;
    const userId = req?.userInfo?.userId;
    const productData = await Product.updateProduct({ parentTree: userId, productId }, req.validatedParams);
    const message = (productData?.nModified) ? user.updateSuccess : user.notFound;
    handleSuccessNew(req, res, { nModified: productData?.nModified }, message);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};

/**
 * @description This function has method related to All shorten Urls List
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.deleteProductData = async (req, res) => {
  try {
    const { productId } = req.validatedParams;
    const userId = req?.userInfo?.userId;
    const record = await Product.deleteProduct({ parentTree: userId, productId });
    const message = (record?.deletedCount) ? user.commonSuccess : user.notFound;
    handleSuccessNew(req, res, record, message);
  } catch (error) {
    handleFailureNew(req, res, error);
  }
};



