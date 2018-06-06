const logger = require('./log.js'); 
const sleep = require('./util.js').sleep;
const guid = require('./util.js').guid;
const getRandomInt = require('./util.js').getRandomInt;
const BankManager = require('./BankManager.js').BankManager;

async function makeTransfers(fromAccount, toBank, toAccount) {
    for (;;) {
        // delay fund transfer create requests for 5 to 10 seconds
        let waitTime = getRandomInt(5000, 10000);
        let amount = getRandomInt(1, 100);
        fromAccount.createFundTransfer(guid(), amount, toBank, toAccount);
        await sleep(waitTime);
    }
}

function main() {
    const bank1 = new BankManager('bank1', 'USD', '127.0.0.1:3001');
    const bank1account1 = bank1.createBankAccount(11, 10000); // bank1 has an account numbered 11
    const bank1account2 = bank1.createBankAccount(12, 10000); // bank1 has an account numbered 12
    const bank2 = new BankManager('bank2', 'EURO', '127.0.0.1:3002');
    const bank2account1 = bank2.createBankAccount(21, 10000); // bank2 has an account numbered 21
    
    // these loop forever ...
    makeTransfers(bank1account1, 'bank2', 21);
    makeTransfers(bank1account2, 'bank2', 21);
    makeTransfers(bank2account1, 'bank1', 11);
    makeTransfers(bank2account1, 'bank1', 12);
}

main();