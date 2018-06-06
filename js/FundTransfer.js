const logger = require('./log.js');

const TRANSFER_STATES = {
    CREATED: 'Created',
    SUBMITTED: 'Submitted',
    PAID_IN_PRINCIPAL: 'Paid in principal',
    PAID: 'Paid'
}

module.exports.TRANSFER_STATES = TRANSFER_STATES;

module.exports.FundTransfer = class {
    constructor(transferID, amount, currency, toBank, toAccount, fromBank, fromAccount, transferType='Debit') {
        this.id = transferID;
        this.state = TRANSFER_STATES.CREATED;
        this.amount = amount;
        this.currency = currency;
        this.toBank = toBank;
        this.toAccount = toAccount;
        this.fromBank = fromBank;
        this.fromAccount = fromAccount;        
        this.createdTimestamp = Date.now();
        this.submittedTimestamp;
        this.paidInPrincipleTimestamp;
        this.paidTimestamp;
        this.transferType;
        logger.info('FundTransfer: Created new transfer ' + this.id);
        logger.debug(this);
    }
    markSubmitted() {
        this.state = TRANSFER_STATES.SUBMITTED;
        this.submittedTimestamp = Date.now();
        logger.info('FundTransfer: Set ' + this.id + ' state to SUBMITTED');
    }
    markPaidInPriciple() {
        this.state = TRANSFER_STATES.PAID_IN_PRINCIPAL;
        this.paidInPrincipleTimestamp = Date.now();
        logger.info('FundTransfer: Set ' + this.id + ' state to PAID_IN_PRINCIPAL');
    }
    markPaid() {
        this.state = TRANSFER_STATES.PAID;
        this.paidTimestamp = Date.now();
        logger.info('FundTransfer: Set ' + this.id + ' state to PAID');
    }
}
