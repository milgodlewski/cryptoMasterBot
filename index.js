const { getUserInput } = require('./userInput');
const getHistoricalData = require('./historicalData');
const { analyze } = require('./pricePatterns');
const { calculateAndPrintStatistics } = require('./statistics');

async function main() {
  const { symbol, startDate, endDate, interval } = await getUserInput();
  const historicalData = await getHistoricalData(symbol, startDate, endDate, interval);
  
  const closePrices = historicalData.map(data => data.close);
  const volumes = historicalData.map(data => data.volume);
  const patterns = analyze(closePrices, volumes); 
  
  calculateAndPrintStatistics(patterns, closePrices);
}

main();
