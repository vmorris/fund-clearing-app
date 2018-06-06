const logger = require('./log.js'); 
const axios = require('axios');

module.exports.createTransferRequest = function (url, data) {
    const requestURL = url + 'SubmitTransferRequest';
    logger.debug('rest.createTransferRequest requestURL = ' + requestURL);
    const instance = axios.create({baseURL: requestURL});
    return instance.post(requestURL, data);
}

module.exports.getRates = function () {
    const requestURL = 'https://free.currencyconverterapi.com/api/v5/convert?q=USD_EUR,USD_GBP';
    const instance = axios.create({baseURL: requestURL});
    return instance.get(requestURL);
}

module.exports.createBatch = function (url, data) {
    const requestURL = url + 'CreateBatch';
    const instance = axios.create({baseURL: requestURL});
    return instance.post(requestURL, data);
}