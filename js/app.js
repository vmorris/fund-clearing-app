const logger = require('./log.js'); 
const sleep = require('./util.js').sleep;
const guid = require('./util.js').guid;
const getRandomInt = require('./util.js').getRandomInt;
const BankManager = require('./BankManager.js').BankManager;

async function makeTransfers(fromAccount, toBank, toAccount) {
    for (;;) {
        // wait some amount of time between 3 and 10 seconds
        let waitTime = getRandomInt(3000, 10000);
        let amount = getRandomInt(1, 100);
        fromAccount.createFundTransfer(guid(), amount, toBank, toAccount);
        await sleep(waitTime);
    }
}

function main() {
    const bank1 = new BankManager('bank1', 'USD', 'http://127.0.0.1:3001/api/');
    const bank1account1 = bank1.createBankAccount(11, 10000);
    const bank1account2 = bank1.createBankAccount(12, 20000);
    const bank2 = new BankManager('bank2', 'EURO', 'http://127.0.0.1:3002/api/');
    const bank2account1 = bank2.createBankAccount(21, 30000);
    
    makeTransfers(bank1account1, 'bank2', 21);
    makeTransfers(bank1account2, 'bank2', 21);
    makeTransfers(bank2account1, 'bank1', 11);
    makeTransfers(bank2account1, 'bank1', 12);
}

main();