import { groupPatternsByType } = from "./groupedPatterns";

function isValidNumber(value) {
  return !isNaN(value) && isFinite(value);
}

function calculateMean(array) {
  const validNumbers = array.filter(isValidNumber);
  if (validNumbers.length === 0) return null;
  const sum = validNumbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return sum / validNumbers.length;
}

function calculateMedian(array) {
  const validNumbers = array.filter(isValidNumber);
  if (validNumbers.length === 0) return null;
  const sortedArray = validNumbers.slice().sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedArray.length / 2);

  if (sortedArray.length % 2 === 0) {
    return (sortedArray[middleIndex - 1] + sortedArray[middleIndex]) / 2;
  } else {
    return sortedArray[middleIndex];
  }
}

function calculateStandardDeviation(array) {
  const validNumbers = array.filter(isValidNumber);
  if (validNumbers.length === 0) return null;
  const average = calculateMean(validNumbers);
  const squaredDifferences = validNumbers.map(value => (value - average) ** 2);
  const variance = calculateMean(squaredDifferences);
  return Math.sqrt(variance);
}

function printPriceStatistics(patterns, prices) {
  const patternPrices = patterns.map(pattern => prices[pattern.index]); // Zmienione tutaj
  const mean = calculateMean(patternPrices);
  const median = calculateMedian(patternPrices);
  const stddev = calculateStandardDeviation(patternPrices);

  console.log(`  Statystyki cen wzorców: Średnia: ${mean !== null ? mean.toFixed(2) : 'N/A'}, Mediana: ${median !== null ? median.toFixed(2) : 'N/A'}, Odchylenie standardowe: ${stddev !== null ? stddev.toFixed(2) : 'N/A'}`);
}

function calculateAndPrintStatistics(patterns, closePrices) {
  const patternStats = {};

  for (const pattern of patterns) {
    if (!patternStats[pattern.type]) {
      patternStats[pattern.type] = {
        count: 0,
        prices: [],
      };
    }

    patternStats[pattern.type].count++;
    const patternPrice = closePrices[pattern.index];
    patternStats[pattern.type].prices.push(patternPrice);
  }

  console.log("Statystyki cen wzorców:");
  const allPrices = closePrices.slice(1, closePrices.length - 2); // Pomiń pierwszy i dwa ostatnie elementy, ponieważ nie są używane w analizie wzorców
  const mean = calculateMean(allPrices);
  const median = calculateMedian(allPrices);
  const standardDeviation = calculateStandardDeviation(allPrices, mean);
  console.log(
    `  Średnia: ${mean.toFixed(2)}, Mediana: ${median.toFixed(
      2,
    )}, Odchylenie standardowe: ${standardDeviation.toFixed(2)}`
  );

  for (const patternType in patternStats) {
    console.log(`${patternType}: ${patternStats[patternType].count}`);
  }
}


export { calculateAndPrintStatistics };