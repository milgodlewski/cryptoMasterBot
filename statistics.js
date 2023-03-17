function isValidNumber(value) {
  return !isNaN(value) && isFinite(value);
}

function calculateAverage(array) {
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
  const average = calculateAverage(validNumbers);
  const squaredDifferences = validNumbers.map(value => (value - average) ** 2);
  const variance = calculateAverage(squaredDifferences);
  console.log("standardDeviation - " + Math.sqrt(variance));
  return Math.sqrt(variance);
}

function calculatePatternLengthStatistics(patterns) {
  const patternLengths = patterns.map(pattern => pattern.length);
  const average = calculateAverage(patternLengths);
  const median = calculateMedian(patternLengths);
  const standardDeviation = calculateStandardDeviation(patternLengths);

  return { average, median, standardDeviation };
}

function printStats(patternName, patterns) {
  if (patterns.length === 0) {
    console.log(`\n${patternName}: brak wzorców`);
    return;
  }

  const { average, median, standardDeviation } = calculatePatternLengthStatistics(patterns);
  console.log('DUPA');
  console.log(`\n${patternName}: ${patterns.length}`);
  console.log(
    `  Statystyki długości wzorców: Średnia: ${average ? average.toFixed(2) : "brak danych"}, Mediana: ${
      median !== null ? median : "null"
    }, Odchylenie standardowe: ${standardDeviation ? standardDeviation.toFixed(2) : "brak danych"}`
  );
}

module.exports = {
  calculatePatternLengthStatistics
};
