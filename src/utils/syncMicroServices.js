/**
 * @author Anuj Tomar
 * @description this file has common methods which used in entire application to call third-party apis/microservices apis
 */
const axios = require('axios');
module.exports.microServices = {
  /**
   * @description Microservice
   * @param {string} url Url value
   * @param {object} payload Payload
   * @param {object} header Payload
   */
  post: (url, payload, header) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: url,
        headers: header,
        data: payload,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error.response);
        });
    });
  },
  /**
   * @description Put method
   * @param {string} url Url value
   * @param {object} payload Payload
   * @param {object} header Payload
   */
  put: (url, payload, header) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'PUT',
        url: url,
        headers: header,
        data: payload,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error.response);
        });
    });
  },
  /**
   * @description Get method
   * @param {string} url Url value
   * @param {object} payload Payload
   * @param {object} header Payload
   */
  get: (url, payload, header) => {
    return new Promise((resolve) => {
      axios({
        method: 'GET',
        url: url,
        headers: header,
        data: payload,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          resolve(error.response);
        });
    });
  },
};
