const mongoose = require('mongoose');
const Models = require('../config/model.constants.js');
const { secondsSinceEpoch, generateId } = require('../utils/helpers.js');

const schema = new mongoose.Schema({
  productId: { type: String, default: () => generateId(), index: true, required: true, search: false },
  productName: { type: String, default: '', search: true },
  description: { type: String, default: '', search: true },
  price: { type: String, default: '', search: true },
  category: { type: String, default: '', search: true },
  brand: { type: String, default: '', search: true },
  images: { type: String, default: '', search: true },
  reviews: { type: String, default: '', search: true },
  rating: { type: String, default: '', search: true },
  city: { type: String, default: '', search: true },
  country: { type: String, default: '', search: true },
  status: { type: Boolean, default: true, search: false },
  createdAt: { type: Date, default: () => secondsSinceEpoch(), search: false },
  updatedAt: { type: Date, default: () => secondsSinceEpoch(), search: false },
  token: { type: String, default: '', search: true }
});

class Products {

  static async getProductByCondition(query) {
    return this.findOne(query).lean();
  }

  static async getProductExist(query) {
    return this.countDocuments(query);
  }

  static async updateProduct(selector, payload) {
    return this.updateOne(
      selector,
      { $set: payload }
    );
  }

  static async updateProductProfile(query, payload) {
    return this.updateOne(
      query,
      { $set: payload },
    );
  }

  static async getProductDetails(query) {
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

  static async createProduct(payload) {
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

  static async getLoginDetails(query) {
    return this.findOne(query,
      {
        _id: 0,
        productId: 1,
        productName: 1,
        description: 1,
        price: 1,
        category: 1,
        brand: 1,
        images: 1,
        reviews: 1,
        rating: 1,
        city: 1,
        country: 1,
        status: 1,
      }
    );
  }

  static async getProductList(query, elle) {
    const records = await this.aggregate([
      { $sort: elle?.sorting },
      { $match: query },
      { $skip: Number(elle?.start) },
      { $limit: Number(elle?.length) },
      {
        $project: {
          _id: 0,
          productId: 1,
          productName: 1,
          description: 1,
          price: 1,
          category: 1,
          brand: 1,
          images: 1,
          reviews: 1,
          rating: 1,
          city: 1,
          country: 1,
          status: 1,
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

  static async logoutAll({ productId }) {
    return this.updateOne(
      { productId },
      { $set: { token: "" } },
    );
  }

  static async deleteProduct(payload) {
    return this.deleteOne(payload);
  }

}

schema.loadClass(Products);
module.exports = mongoose.model(Models.PRODUCTS, schema, Models.PRODUCTS);