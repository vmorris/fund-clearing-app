const logger = require('./log.js'); 
const axios = require('axios');

function retryFailedRequest (err) {
    if ( err.status === 500 && err.config && !err.config.__isRetryRequest ) {
        err.config.__isRetryRequest = true;
        return axios(err.config);
    }
    throw err;
}

module.exports.createTransferRequest = function (url, data) {
    const requestURL = 'http://' + url + '/api/SubmitTransferRequest';
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
    const requestURL = 'http://' + url + '/api/CreateBatch';
    const instance = axios.create({baseURL: requestURL});
    return instance.post(requestURL, data);
}

module.exports.getBatchTransferRequest = function (url, data) {
    const requestURL = 'http://' + url + '/api/BatchTransferRequest/' + data;
    const instance = axios.create({baseURL: requestURL});
    instance.interceptors.response.use(undefined, retryFailedRequest);
    return instance.get(requestURL);
}

module.exports.getTransferRequest = function (url, data) {
    const requestURL = 'http://' + url + '/api/TransferRequest/' + data;
    const instance = axios.create({baseURL: requestURL});
    return instance.get(requestURL);
}