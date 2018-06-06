const inspect = require('util').inspect;

const logger = require('./log.js'); 
const sleep = require('./util.js').sleep;
const guid = require('./util.js').guid;
const getRandomInt = require('./util.js').getRandomInt;
const FundTransfer = require('./FundTransfer.js').FundTransfer;
const TX_STATES = require('./FundTransfer.js').TRANSFER_STATES;
const BankAccount = require('./BankAccount.js').BankAccount;
const rest = require('./rest.js');

module.exports.BankManager = class {
    constructor(managerID, currency, restURL) {
        this.bankID = managerID;
        this.currency = currency;
        this.restURL = restURL;
        this.bankTxRequestQueue = {};
        this.BankAccounts = {};
        this.watchQueue();
        this.createBatch();
        logger.info('BankManager: Created ' + this.bankID);
    }
    async createBatch() {
        for (;;) {
            const waitTime = getRandomInt(3000, 10000);
            this.sendCreateBatch();
            await sleep(waitTime);
        }
    }
    async watchQueue() {
        for (;;) {
            // get all the tx ids in request queue
            const keys = Object.keys(this.bankTxRequestQueue);
            logger.debug(this.bankID + 'watchqueue 1 ' + keys);
            if (keys.length > 0) {
                for (let id in keys) {
                    let i = keys[id];
                    logger.debug(this.bankID + 'watchqueue 2 ' + i);
                    logger.debug(this.bankTxRequestQueue[i]);
                    if (this.bankTxRequestQueue[i].state != TX_STATES.SUBMITTED) {
                        logger.info('BankManager: ' + this.bankID + ': Processing ' + i);
                        this.bankTxRequestQueue[i].markSubmitted();
                        this.sendFundTransferRequests(i);
                    }
                }
            }
            const waitTime = getRandomInt(3000, 10000);
            await sleep(waitTime);
            logger.debug(this.bankID + 'watchqueue 3');
        }
    }
    createBankAccount(id, balance) {
        const account = new BankAccount(id, this.bankID, this.currency, balance, this.bankTxRequestQueue);
        this.BankAccounts[account.id] = account;
        return account;
    }
    // detect outgoing fund transfer requests from bankTxRequestQueue
    async sendFundTransferRequests(id) {
        const transfer = this.bankTxRequestQueue[id];
        const data = {
            '$class': 'org.clearing.SubmitTransferRequest',
            'transferId': transfer.id,
            'toBank': transfer.toBank,
            'state': 'PENDING',
            'details': {
                '$class': 'org.clearing.Transfer',
                'currency': transfer.currency,
                'amount': transfer.amount,
                'fromAccount': transfer.fromAccount,
                'toAccount': transfer.toAccount
            }
        }
        try {
            const response = await rest.createTransferRequest(this.restURL, data);
            logger.debug('BankManager: sendTransferRequest ' + id + 'response.status = ' + response.status);
            if (response.status == 200) {
                delete this.bankTxRequestQueue[id];
            }
        }
        catch (error) {
            logger.error(error);
        }
    }
    async sendCreateBatch() {
        try {
            const rates = await rest.getRates();
            const usd2eur = rates.data.results.USD_EUR.val;
            const usd2sterling = rates.data.results.USD_GBP.val;
            const data = {
                "$class": "org.clearing.CreateBatch",
                "batchId": "batch-" + guid(),
                "usdRates": [
                    {"$class":"org.clearing.UsdExchangeRate", "to":"EURO","rate":usd2eur},
                    {"$class":"org.clearing.UsdExchangeRate", "to":"STERLING","rate":usd2sterling}
                ]
            }
            const response = await rest.createBatch(this.restURL, data);
            if (response.status == 200) {
                logger.info('Batch Created!');
            }
        }
        catch (error) {
            logger.error(error);
        }
    }
    // detected incoming credit fund transfer from fund-clearing network
    createCreditTransfer(accountID, amount) {
        //pass
    }
    doPreprocessing() {
        //pass
    }
    doPostProcessing() {
        //pass
    }
}
