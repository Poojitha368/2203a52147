const axios = require('axios');

const STOCK_LIST_URL = 'http://20.244.56.144/evaluation-service/stocks';

async function getStockList() {
  try {
    const response = await axios.get(STOCK_LIST_URL);
    const stocks = response.data.stocks;

    console.log("All Stock Tickers:\n");

    for (const [company, ticker] of Object.entries(stocks)) {
      console.log(`${company} ➜ ${ticker}`);
    }
  } catch (error) {
    console.error('Error fetching stock list:', error.message);
  }
}

getStockList();
