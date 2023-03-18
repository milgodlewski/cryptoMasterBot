class PatternPerformance {
  constructor(priceData, patterns, lookahead = 5) {
    this.priceData = priceData;
    this.patterns = patterns;
    this.lookahead = lookahead;
    this.performance = {};
  }

  analyze() {
    this.processPatterns();
    this.calculateRates();
    return this.performance;
  }

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

  incrementPatternCounters(type, priceChange) {
    if (!this.performance[type]) {
      this.performance[type] = {
        occurrences: 0,
        positive: 0,
        negative: 0,
      };
    }

    this.performance[type].occurrences++;
    if (priceChange > 0) {
      this.performance[type].positive++;
    } else if (priceChange < 0) {
      this.performance[type].negative++;
    }
  }

  calculatePriceChange(currentPrice, futurePrice) {
    return (futurePrice - currentPrice) / currentPrice;
  }

  calculateRates() {
    Object.keys(this.performance).forEach((patternType) => {
      const patternData = this.performance[patternType];
      patternData.positiveRate = patternData.positive / patternData.occurrences;
      patternData.negativeRate = patternData.negative / patternData.occurrences;
    });
  }
}

function patternPerformance(priceData, patterns, lookahead = 5) {
  const performanceAnalyzer = new PatternPerformance(priceData, patterns, lookahead);
  return performanceAnalyzer.analyze();
}

export { patternPerformance };
