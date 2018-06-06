const logger = require('./log.js'); 
const FundTransfer = require('./FundTransfer.js').FundTransfer;

module.exports.BankAccount = class {
    constructor(accountID, bankID, currency, balance, bankTxRequestQueue) {
        this.accountID = accountID;
        this.bankID = bankID;
        this.currency = currency;
        this.balance = balance;
        this.bankTxRequestQueue = bankTxRequestQueue;
        this.transactions = {};
        logger.info('BankAccount: Created ' + this.accountID);
    }
    // createFundTransfer is used for outgoing (debit) transactions
    createFundTransfer(id, amount, toBank, toAccount) {
        const transfer = new FundTransfer(id, amount, this.currency, toBank, toAccount, this.bankID, this.accountID);
        this.bankTxRequestQueue[transfer.id] = transfer;
        logger.info('BankAccount: ' + this.bankID + ' ' + this.accountID + 
            ': New outgoing debit transfer to: ' + toBank + ' ' + toAccount + ': ' + id);
    }
    // appendTransaction is used for incoming (credit) transactions
    appendTransaction(transfer) {
        this.transactions[transfer.id] = transfer;
        logger.info(this.accountID + ': New incoming credit transfer: ' + transfer.id);
    }
}
