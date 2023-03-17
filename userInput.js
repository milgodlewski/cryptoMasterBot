const getHistoricalData = require('./historicalData');
const readline = require('readline');
const { analyzePricePatterns } = require('./pricePatterns');
const { groupPatternsByType } = require('./groupedPatterns');
const { calculatePatternLengthStatistics } = require('./statistics');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getDefaultEndDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getDefaultStartDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

async function getSymbol() {
  return new Promise((resolve) => {
    rl.question('Podaj symbol instrumentu finansowego (domyślnie: BTCUSDT): ', (inputSymbol) => {
      const symbol = inputSymbol.trim() ? inputSymbol : 'BTCUSDT';
      resolve(symbol);
    });
  });
}

async function getStartDate() {
  return new Promise((resolve) => {
    rl.question(`Podaj datę początkową (YYYY-MM-DD, domyślnie: ${getDefaultStartDate()}): `, (startDate) => {
      startDate = startDate || getDefaultStartDate();
      resolve(startDate);
    });
  });
}

async function getEndDate() {
  return new Promise((resolve) => {
    rl.question(`Podaj datę końcową (YYYY-MM-DD, domyślnie: ${getDefaultEndDate()}): `, (endDate) => {
      endDate = endDate || getDefaultEndDate();
      resolve(endDate);
    });
  });
}

async function getInterval() {
  return new Promise((resolve) => {
    const intervalQuestion = 'Podaj interwał czasowy (1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M, domyślnie: 1d): ';
    const intervals = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'];

    rl.question(intervalQuestion, (intervalAnswer) => {
      resolve(intervals.includes(intervalAnswer) ? intervalAnswer : '1d');
    });
  });
}

async function getUserInput() {
  return new Promise(async (resolve, reject) => {
    const symbol = await getSymbol();
    const startDate = await getStartDate();
    const endDate = await getEndDate();
    const interval = await getInterval();
    rl.close();

    console.log('Params:', { symbol, startDate, endDate, interval }); 

    const data = await getHistoricalData(symbol, startDate, endDate, interval);

    if (data) {
      const closePrices = data.map((entry) => entry.close);
      const volumes = data.map((entry) => entry.volume);
      const dates = data.map((entry) => new Date(entry.closeTime).toISOString().slice(0, 10));
      resolve({ symbol, startDate, endDate, interval, closePrices, volumes, dates });
    } else {
      reject('Nie udało się pobrać danych historycznych.');
    }
  });
}



module.exports = {
  getUserInput,
};