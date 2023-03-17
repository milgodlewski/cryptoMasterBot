const { getUserInput } = require('./userInput');
const { analyzePricePatterns } = require('./pricePatterns');
const { groupPatternsByType } = require('./groupedPatterns');
const { calculatePatternLengthStatistics } = require('./statistics');
const getHistoricalData  = require('./historicalData');

async function main() {
  try {
    const { symbol, startDate, endDate, interval } = await getUserInput();
    const data = await getHistoricalData(symbol, startDate, endDate, interval);
    const closePrices = data.map(entry => entry.close);
    const volumes = data.map(entry => entry.volume); // Dodajemy tę linię, aby stworzyć tablicę volumes
    const pricePatterns = analyzePricePatterns(closePrices, volumes); // Poprawiamy na volumes

    console.log('\nWystąpienia wzorców cenowych:\n');
    pricePatterns.forEach(pattern => { // Zmieniamy groupedPatterns na pricePatterns
      console.log(`Typ: ${pattern.type}, Długość: ${pattern.length}, Indeks: ${pattern.index}`);
    });

  } catch (error) {
    console.error('Wystąpił błąd:', error);
  }
}

main();
