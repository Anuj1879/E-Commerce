const mongoose = require('mongoose');
const Models = require('../config/model.constants.js');
const { secondsSinceEpoch, generateId } = require('../utils/helpers.js');

const schema = new mongoose.Schema({
    orderId: { type: String, default: () => generateId(), index: true, required: true, search: false },
    customerId:{},
    orderDate: { type: Date, default: () => secondsSinceEpoch(), search: false },
    status: { type: String, default: '', search: true },
    totalPrice: { type: String, default: '', search: true },
    shippingAddress: { type: String, default: '', search: true },
    billingAddress: { type: String, default: '', search: true },
    paymentMethod: { type: String, default: '', search: true },
    paymentStatus: { type: String, default: '', search: true },
    items: { type: String, default: '', search: true },
    shippingCost: { type: String, default: '', search: true },
    tax: { type: String, default: '', search: true },
});

class Orders {

  static async getOrderByCondition(query) {
    return this.findOne(query).lean();
  }

  static async getOrderExist(query) {
    return this.countDocuments(query);
  }

  static async updateOrder(selector, payload) {
    return this.updateOne(
      selector,
      { $set: payload }
    );
  }

  static async updateOrderProfile(query, payload) {
    return this.updateOne(
      query,
      { $set: payload },
    );
  }

  static async getOrderDetails(query) {
    return this.findOne(query, {
      _id: 0,
      '__v': 0,
      updatedAt: 0,
      password: 0,
      userSalt: 0,
      token: 0
    }
    );
  }

  static async createOrder(payload) {
    return this.create(payload);
  }

  static async updatePassword(productId, encryptPassword) {
    return this.update(
      { productId },
      { $set: { password: encryptPassword } }
    );
  }

  static async updateToken(query, update) {
    return this.updateOne(query, { $set: update });
  }

  static async getOrderList(query, elle) {
    const records = await this.aggregate([
      { $sort: elle?.sorting },
      { $match: query },
      { $skip: Number(elle?.start) },
      { $limit: Number(elle?.length) },
      {
        $project: {
          _id: 0,
          orderId: 1,
          customerId: 1,
          orderDate: 1,
          status: 1,
          totalPrice: 1,
          shippingAddress: 1,
          billingAddress: 1,
          paymentMethod: 1,
          paymentStatus: 1,
          items: 1,
          shippingCost: 1,
          tax: 1,
        }
      }
    ]);
    if (records.length) {
      const count = await this.aggregate([
        { $match: query },
        { $group: { _id: null, count: { $sum: 1 } } },
        { $project: { _id: 0 } }
      ]);
      return { records, count: count[0].count };
    } else {
      return null;
    }
  }

  static async deleteProduct(payload) {
    return this.deleteOne(payload);
  }

}

schema.loadClass(Products);
module.exports = mongoose.model(Models.PRODUCTS, schema, Models.PRODUCTS);