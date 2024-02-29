/* eslint-disable */
const mongoose = require('mongoose');
const config = require('../config/index.js');

/**
 * @description This method related to connect with the database
 */
module.exports = async () => {
  return new Promise(async (resolve) => {
    const options = {
      // keepAlive: true,
      // useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      // useUnifiedTopology: true,
    };
    try {
      console.log(config.mongoDB, options);
      const connection = await mongoose.connect(config.mongoDB, options);
      
      const db = connection.connection.db;
      console.log(`Connected to MongoDB: ${connection.connections[0].name}`);
      resolve(true);
    } catch (err) {
      console.error('Error connecting to MongoDB:', err.message);
      resolve(false);
    }
  });
};