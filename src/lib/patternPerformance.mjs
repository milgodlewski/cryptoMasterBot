/**
* PatternPerformance - A class to analyze the performance of detected candlestick patterns.
*/
class PatternPerformance {
  
  static DEFAULT_LOOKAHEAD = 5; // Default number of bars to look ahead for calculating price change
  /**
  * constructor - Initializes the PatternPerformance class.
  * @param {Array} priceData Array of price data, where each element is a numerical price value.
  * @param {Array} patterns Array of detected candlestick patterns, where each element contains { index, type }.
  * @param {number} lookahead The number of bars to look ahead for calculating price change (default: 5).
  */
  constructor(priceData, patterns, lookahead = PatternPerformance.DEFAULT_LOOKAHEAD) {
    if (!Array.isArray(priceData) || !Array.isArray(patterns)) {
      throw new Error('Invalid input data. Both priceData and patterns must be arrays.');
    }
    
    this.priceData = priceData;
    this.patterns = patterns;
    this.lookahead = lookahead;
    this.performance = {};
  }
  
  /**
  * analyze - Analyzes the performance of the detected candlestick patterns.
  * @returns {Object} An object containing the performance statistics for each pattern type.
  */
  analyze() {
    this.processPatterns();
    this.calculateRates();
    return this.performance;
  }
  
  /**
  * processPatterns - Processes the detected patterns and calculates price change for each pattern.
  */
  processPatterns() {
    this.patterns.forEach((pattern) => {
      const { index, type } = pattern;
      const currentPrice = this.priceData[index];
      
      if (index + this.lookahead < this.priceData.length) {
        const futurePrice = this.priceData[index + this.lookahead];
        const priceChange = this.calculatePriceChange(currentPrice, futurePrice);
        
        this.incrementPatternCounters(type, priceChange);
      }
    });
  }
  
  /**
  * incrementPatternCounters - Increments the performance counters for a given pattern type based on the price change.
  * @param {string} type The type of the pattern.
  * @param {number} priceChange The price change between the current price and the future price.
  */
  incrementPatternCounters(type, priceChange) {
    if (!this.performance[type]) {
      this.performance[type] = {
        occurrences: 0,
        positive: 0,
        negative: 0,
      };
    }
    
    this.performance[type].occurrences++;
    priceChange > 0
    ? this.performance[type].positive++
    : priceChange < 0
    ? this.performance[type].negative++
    : null;
  }
  
  /**
  * calculatePriceChange - Calculates the relative price change between two price values.
  * @param {number} currentPrice The current price value.
  * @param {number} futurePrice The future price value.
  * @returns {number} The relative price change.
  */
  calculatePriceChange(currentPrice, futurePrice) {
    return (futurePrice - currentPrice) / currentPrice;
  }
  
  /**
  * calculateRates - Calculates the positive and negative rates for each pattern type.
  */
  calculateRates() {
    Object.keys(this.performance).forEach((patternType) => {
      const patternData = this.performance[patternType];
      patternData.positiveRate = patternData.positive / patternData.occurrences;
      patternData.negativeRate = patternData.negative / patternData.occurrences;
    });
  }
}

/**
* patternPerformance - Analyzes the performance of the given patterns against price data.
*
* @param {Array} priceData Array of price data, where each element is a numerical value representing the price.
* @param {Array} patterns Array of patterns, where each element is an object with properties { index, type }.
* @param {number} [lookahead=PatternPerformance.DEFAULT_LOOKAHEAD] The number of data points to look ahead to determine the price change.
* @returns {Object} An object containing the performance of each pattern type, with properties { occurrences, positive, negative, positiveRate, negativeRate }.
*
* This function takes an array of price data and an array of patterns to analyze their performance.
* The price change is calculated by looking ahead a specified number of data points (default is 5).
* The function returns an object with the performance of each pattern type, including the number of occurrences,
* the number of positive and negative outcomes, and the corresponding rates.
*
* Example usage:
* const priceData = [100, 101, 102, 103, 104, 105];
* const patterns = [
*   { index: 0, type: 'bullish' },
*   { index: 1, type: 'bearish' },
* ];
*
* const performance = patternPerformance(priceData, patterns);
* // performance = {
* //   bullish: { occurrences: 1, positive: 1, negative: 0, positiveRate: 1, negativeRate: 0 },
* //   bearish: { occurrences: 1, positive: 0, negative: 1, positiveRate: 0, negativeRate: 1 },
* // }
*/
function patternPerformance(priceData, patterns, lookahead = PatternPerformance.DEFAULT_LOOKAHEAD) {
  const performanceAnalyzer = new PatternPerformance(priceData, patterns, lookahead);
  return performanceAnalyzer.analyze();
}

export { patternPerformance };
