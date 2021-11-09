# transactions-test-task
Sometimes the server responds with the duplicate transactions. We need to sort them on the frontend.

Duplicate transactions have the same `sourceAccount`, `targetAccount`, `amount`, `category`, and they have the same transaction time (up to 60 seconds consistently)

Though, the transaction with time `00:35:00`, `00:35:15` and `00:36:00` are the same transaction, but `00:37:01` - is the different one. 

The function findDuplicateTransactions should return `Transactions[][]` array with duplicates array (See expected results in the `test.js` file)

Your goal is to change `findDuplicateTransactions` function and run `npm start` so all tests are passed.
