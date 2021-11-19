function findDuplicateTransactions (transactions = []) {
  if (!transactions.length) {
    return []
  }

  const matchingProperties = ["sourceAccount", "targetAccount", "category", "amount"];
  const allowedTimeBetweenTransactions = 60; // seconds

  let duplicateTransactions = [];

  transactions
    // 1) sort transactions by the time created (this way we have always first transaction in the beginning)
    .sort((transaction1, transaction2) => {
      return (new Date(transaction1.time)).getTime() - (new Date(transaction2.time)).getTime()
    })
    // 2) create a duplicateTransactions array with the same properties
    .forEach(transaction => {
      const existingTransactionList = duplicateTransactions.find(transactionList => {
        return transactionList.some(checkTransaction => {
          return matchingProperties.every(property => checkTransaction[property] === transaction[property])
        })
      })
      if (existingTransactionList) {
        existingTransactionList.push(transaction); // add to existing transaction list
      } else {
        duplicateTransactions.push([transaction]); // create a new array with the current transaction
      }
    });

  duplicateTransactions = duplicateTransactions
    // 3) flat map transactions by the time created
    .flatMap(transactionList => {
      if (transactionList.length === 1) {
        return [] // we don't need to check anything and to add it to duplicates if the transaction is only one and original
      }

      let resultList = [
        [transactionList[0]]
      ]; // the new sorted list with correct times

      let lastTransactionTime = (new Date(transactionList[0].time)).getTime();
      let resultListIndex = 0;

      transactionList.forEach((checkTransaction, checkTransactionIndex) => {
        if (!checkTransactionIndex) { // skip the first one as we don't need to check it
          return
        }
        const checkTransactionTime = (new Date(checkTransaction.time)).getTime();
        const timeBetweenTransactions = (checkTransactionTime - lastTransactionTime) / 1000; // here we receive seconds by taking time diff / 1000

        if (timeBetweenTransactions <= allowedTimeBetweenTransactions && timeBetweenTransactions > 0) {
          resultList[resultListIndex].push(checkTransaction); // add to already existing transaction list
        } else {
          resultListIndex++;
          resultList.push([checkTransaction]); // new array with new transaction times
        }

        lastTransactionTime = checkTransactionTime; // update checking time
      })

      return resultList // return flattened list
    })
    // 4) remove transactions that doesn't have duplicates
    .filter(transactionList => transactionList.length > 1)
    // 5) sort transactions lists by the time of the first transaction
    .sort((transactionList1, transactionList2) => {
      return (new Date(transactionList1[0].time)).getTime() - (new Date(transactionList2[0].time)).getTime()
    })

  return duplicateTransactions;
}

module.exports = findDuplicateTransactions
