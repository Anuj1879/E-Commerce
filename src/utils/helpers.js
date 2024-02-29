/* eslint-disable */
/**
 * @author Anuj Tomar
 * @description this file has common methods which used in entire application
 */
const config = require('../config/index');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const { errorGlobal } = require('./errorMessages');
const { v4: uuidv4 } = require('uuid');
module.exports = {
  processStringToUrlFriendly: (value) => {
    return value == undefined
      ? ''
      : value
        .replace(/[^a-z0-9_]+/gi, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();
  },
  generateRandomNumbers(count) {
    const randomNumbers = [];
    for (let i = 0; i < count; i++) {
        randomNumbers.push(Math.floor(Math.random() * 101)); // Generates random number between 0 and 100
    }
    return randomNumbers;
},
  getDocumentIdString: (doc) => {
    return doc._id.toString();
  },
  generateId: () => {
    return uuidv4();
  },
  handleSuccess: (res, data, message) => {
    const response = {
      data: data,
      error: null,
    };
    if (message) response.message = message;
    res.status(200).send(response);
  },
  handleSuccessNew: (req, res, data, message) => {
    const response = {
      data,
      error: null,
    };
    if (message) response.message = message;
    loggerNew.info({ apiName: req?.route?.path, message });
    res.status(200).send(response);
  },
  handleFailure: (res, statusCode, message) => {
    res
      .status(statusCode || 500)
      .send({ error: true, message: message || 'Server error' });
  },
  handleFailureNew: (req, res, error) => {
    console.log(error.message);
    let splitError = error.message.trim().split(',');
    if (splitError.length == 1) splitError = ['400', splitError[0]]
    const errorCode = errorGlobal.includes(splitError[0]) ? Number(splitError[0]) : 500;
    const message = splitError[1] || 'Server error';
    loggerNew.error({ apiName: req?.route?.path, message });
    if(config?.ERROR_LOG=='true') console.log(error);
    res.status(errorCode).send({ errorCode, error: true, message });
  },
  getS3Object: (bucket, key) => {
    return new Promise((resolve, reject) => {
      s3.getObject(
        {
          Bucket: bucket,
          Key: key,
        },
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        }
      );
    });
  },
  removeItemFromScalarAarray: (array, value) => {
    const index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  },
  getS3Stream: (bucket, filename) => {
    return s3.getObject({ Bucket: bucket, Key: filename }).createReadStream();
  },
  deleteS3Object: (objects) => {
    return new Promise((resolve, reject) => {
      s3.deleteObjects(
        { Bucket: config.bucketPath, Delete: { Objects: objects } },
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        }
      );
    });
  },
  clean: (obj) => {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  },
  secondsSinceEpoch: () => {
    return Date.now();
  },
  generateToken: ({ data }) => {
    return new Promise((res, rej) => {
      jwt.sign(data, config.jwtTokenKey, (err, token) => {
        if (err) {
          rej(true);
        } else {
          res(token);
        }
      });
    });
  },
  verifyToken: (token) => {
    return new Promise((res, rej) => {
      const bearer = token.split(' ')[1];
      jwt.verify(bearer, config.jwtTokenKey, async (err, authdata) => {
        if (err) {
          rej(err);
        } else {
          res(authdata);
        }
      });
    });
  },
  decodedToken: ({ token }) => {
    return new Promise((res, rej) => {
      jwt.verify(token, config.jwtTokenKey, async (err, authdata) => {
        if (err) {
          rej(err);
        } else {
          res(authdata);
        }
      });
    });
  },
  genRand: (length) => {
    const allowsChars = '0123456789';
    let userId = '';
    for (let index = 0; index < length; ++index) {
      const charIndex = _rand(0, allowsChars.length - 1);
      userId += allowsChars[charIndex];
    }
    return userId;
  },
  generatePassword: (length) => {
    return Math.round(
      Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)
    )
      .toString(36)
      .slice(1)
      .toUpperCase();
  },
  validateEmail: (email) => {
    return email.match(
      /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i
    );
  },
  searchAlgorithm: (ModelsArray, element) => {
    let search = [{}];
    if (element) {
      search = [];
      const ModelObject = Object.values(ModelsArray);
      let ModelName = Object.keys(ModelsArray);
      ModelObject.forEach((item, key) => {
        Object.values(item.schema.paths).filter(function (hero) {
          if (hero.options.search == undefined) {
            if (typeof hero.options.type == 'object') {
              hero.options.type.map(item => {
                for (const [k, v] of Object.entries(item)) {
                  if (v.search) {
                    search.push({ [ModelName[key] + '.' + hero.path + '.' + k]: { $regex: element, $options: 'i' } })
                  }
                }
              })
            }
          }
          if (hero.options.search && hero.options.search != undefined) {
            let value = element;
            if (key == 0) {
              search.push({ [hero.path]: { $regex: value, $options: 'i' } });
            } else {
              search.push({
                [ModelName[key] + '.' + hero.path]: {
                  $regex: value,
                  $options: 'i',
                },
              });
            }
          }
        });
      });
    }
    return search;
  },
  generateSlug: (length) => {
    let generatedSlug = "";
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (i = 0; i < length; i++) {
      generatedSlug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return generatedSlug;
  },
  starRating: (rValues) => {
    const [r1 = 0, r2 = 0, r3 = 0, r4 = 0, r5 = 0] = rValues;
    const numerator = 5 * r5 + 4 * r4 + 3 * r3 + 2 * r2 + r1;
    const denominator = r5 + r4 + r3 + r2 + r1;
    const result = numerator / denominator;
    return Number(result.toFixed(1));
  }

};

/**
 * @description This is
 * @param  {Number} min is
 * @param  {Number} max is
 */
const _rand = (min, max) => {
  const random = Math.random();
  return Math.floor(random * (max - min) + min);
};

/**
 * @description This is common Function to manage All the logs of the Entire Application
 */
const loggerNew = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "./logs/error.log", // filepath 
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          (info) =>
            `[${info.timestamp}] ${info.level}: ${info.message} API Name: ${info.apiName} userId: ${info.userId}`
        )
      ),
    }),
    new winston.transports.File({
      filename: "./logs/info.log", // filepath
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          (info) =>
            `[${info.timestamp}] ${info.level}: ${info.message} API Name: ${info.apiName} userId: ${info.userId}`
        )
      ),
    }),
  ],
});