class PatternStatistics {
  static isValidNumber(value) {
    return !isNaN(value) && isFinite(value);
  }

  static calculateMean(array) {
    const validNumbers = array.filter(this.isValidNumber);
    if (validNumbers.length === 0) return null;
    const sum = validNumbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum / validNumbers.length;
  }

  static calculateMedian(array) {
    const validNumbers = array.filter(this.isValidNumber);
    if (validNumbers.length === 0) return null;
    const sortedArray = validNumbers.slice().sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedArray.length / 2);

    if (sortedArray.length % 2 === 0) {
      return (sortedArray[middleIndex - 1] + sortedArray[middleIndex]) / 2;
    } else {
      return sortedArray[middleIndex];
    }
  }

  static calculateStandardDeviation(array) {
    const validNumbers = array.filter(this.isValidNumber);
    if (validNumbers.length === 0) return null;
    const average = this.calculateMean(validNumbers);
    const squaredDifferences = validNumbers.map(value => (value - average) ** 2);
    const variance = this.calculateMean(squaredDifferences);
    return Math.sqrt(variance);
  }

  static printPriceStatistics(patterns, prices) {
    const patternPrices = patterns.map(pattern => prices[pattern.index]);
    const mean = this.calculateMean(patternPrices);
    const median = this.calculateMedian(patternPrices);
    const stddev = this.calculateStandardDeviation(patternPrices);

    console.log(`  Statystyki cen wzorców: Średnia: ${mean !== null ? mean.toFixed(2) : 'N/A'}, Mediana: ${median !== null ? median.toFixed(2) : 'N/A'}, Odchylenie standardowe: ${stddev !== null ? stddev.toFixed(2) : 'N/A'}`);
  }

  static calculateAndPrintStatistics(patterns, closePrices) {
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
    const allPrices = closePrices.slice(1, closePrices.length - 2);
    const mean = this.calculateMean(allPrices);
    const median = this.calculateMedian(allPrices);
    const standardDeviation = this.calculateStandardDeviation(allPrices, mean);
    console.log(
      `  Średnia: ${mean.toFixed(2)}, Mediana: ${median.toFixed(
        2,
      )}, Odchylenie standardowe: ${standardDeviation.toFixed(2)}`
    );

    for (const patternType in patternStats) {
      console.log(`${patternType}: ${patternStats[patternType].count}`);
    }
  }
}

export default PatternStatistics;
