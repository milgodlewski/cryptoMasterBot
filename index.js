const { getUserInput } = require('./userInput');
const { analyzePricePatterns } = require('./pricePatterns');
const { groupPatternsByType } = require('./groupedPatterns');
const { calculatePatternLengthStatistics } = require('./statistics');

async function main() {
  try {
    const { symbol, startDate, endDate, interval, closePrices, volumes, dates } = await getUserInput();
    const pricePatterns = analyzePricePatterns(closePrices, volumes);
    const groupedPatterns = groupPatternsByType(pricePatterns);

    console.log('\nWystąpienia wzorców cenowych:\n');
    for (const patternType in groupedPatterns) {
      console.log(`${patternType}: ${groupedPatterns[patternType].length}`);

      const statistics = calculatePatternLengthStatistics(groupedPatterns[patternType]);
      console.log(
        `  Statystyki długości wzorców: Średnia: ${
          statistics.average !== null ? statistics.average.toFixed(2) : "brak danych"
        }, Mediana: ${statistics.median}, Odchylenie standardowe: ${
          statistics.standardDeviation !== null
            ? statistics.standardDeviation.toFixed(2)
            : "brak danych"
        }`
      );
    }

  } catch (error) {
    console.error('Wystąpił błąd:', error);
  }
}

main(); 