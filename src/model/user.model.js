const mongoose = require('mongoose');
const Models = require('../config/model.constants.js');
const { secondsSinceEpoch, generateId } = require('../utils/helpers.js');

const schema = new mongoose.Schema({
  userId: { type: String, default: () => generateId(), index: true, required: true, search: false },
  email: { type: String, default: '', required: true, search: true },
  firstName: { type: String, default: '', search: true },
  middleName: { type: String, default: '', search: true },
  lastName: { type: String, default: '', search: true },
  userType: { type: String, default: '', search: true },
  mobile: { type: String, default: '', search: true },
  password: { type: String, default: '', required: true, search: false },
  userSalt: { type: String, default: '', search: false },
  mobileVerifiedCode: { type: Number, default: null, search: false },
  passwordRecoveryToken: { type: String, default: '', search: false },
  passwordRecoveryStartedAt: { type: Date, default: null, search: false },
  about: { type: String, default: '', search: true },
  language: { type: Array, default: ['English'], search: true },
  city: { type: String, default: '', search: true },
  country: { type: String, default: '', search: true },
  status: { type: Boolean, default: true, search: false },
  createdAt: { type: Date, default: () => secondsSinceEpoch(), search: false },
  updatedAt: { type: Date, default: () => secondsSinceEpoch(), search: false },
  token: { type: String, default: '', search: true }
});

class Users {

  static async getUserByCondition(query) {
    return this.findOne(query).lean();
  }

  static async getUserExist(query) {
    return this.countDocuments(query);
  }

  static async updateUser(selector, payload) {
    return this.updateOne(
      selector,
      { $set: payload }
    );
  }

  static async updateProfile(query, payload) {
    return this.updateOne(
      query,
      { $set: payload },
    );
  }

  static async getUserDetails(query) {
    return this.findOne(query, {
      _id: 0,
      '__v': 0,
      facebook: 0,
      google: 0,
      apple: 0,
      emailVerifiedToken: 0,
      mobileVerifiedCode: 0,
      passwordRecoveryToken: 0,
      passwordRecoveryStartedAt: 0,
      updatedAt: 0,
      password: 0,
      userSalt: 0,
      token: 0
    }
    );
  }

  static async createUser(payload) {
    return this.create(payload);
  }

  static async updatePassword(userId, encryptPassword) {
    return this.update(
      { userId },
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
        email: 1,
        userId: 1,
        username: 1,
        avatar: 1,
        banner: 1,
        password: 1,
        userSalt: 1,
        onboardingStatus: 1,
        termAndCondition: 1,
        userType: 1,
        emailVerified: 1,
        firstName: 1,
        middleName: 1,
        lastName: 1,
        parentId: 1,
        parentTree: 1,
        token: 1,
        
      }
    );
  }

  static async getUsersList(query, elle) {
    const records = await this.aggregate([
      { $sort: elle?.sorting },
      { $match: query },
      { $skip: Number(elle?.start) },
      { $limit: Number(elle?.length) },
      {
        $project: {
          _id: 0,
          email: 1,
          userId: 1,
          username: 1,
          avatar: 1,
          banner: 1,
          userType: 1,
          emailVerified: 1,
          firstName: 1,
          middleName: 1,
          lastName: 1,
          parentId: 1,
          mobile: 1
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

  static async logoutAll({ userId }) {
    return this.updateOne(
      { userId },
      { $set: { token: "" } },
    );
  }

  static async deleteUser(payload) {
    return this.deleteOne(payload);
  }

}

schema.loadClass(Users);
module.exports = mongoose.model(Models.USERS, schema, Models.USERS);