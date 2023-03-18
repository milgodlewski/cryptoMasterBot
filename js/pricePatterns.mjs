class PatternAnalyzer {
  constructor(prices, volume, options = {}) {
    this.defaultOptions = {
      threshold: 0.03,
      volumeThreshold: 0.05,
      rsiPeriod: 14,
      rsiThreshold: 30,
    };
    this.options = { ...this.defaultOptions, ...options };
    this.prices = prices;
    this.volume = volume;
    this.patterns = [];
    this.rsi = this.calculateRSI(this.options.rsiPeriod);
    this.patternsMapping = {
      DoubleBottom: (i) => this.isDoubleBottom(i),
      DoubleTop: (i) => this.isDoubleTop(i),
      SymmetricalTriangle: (i) => this.isTriangle(i, 'symmetrical'),
      AscendingTriangle: (i) => this.isTriangle(i, 'ascending'),
      DescendingTriangle: (i) => this.isTriangle(i, 'descending'),
      Flag: (i) => this.isFlag(i),
      RectangleTriangle: (i) => this.isRectangleTriangle(i),
      HeadAndShoulders: (i) => this.isHeadAndShoulders(i),
      InverseHeadAndShoulders: (i) => this.isInverseHeadAndShoulders(i),
    };
  }

  analyze() {
    for (let i = 1; i < this.prices.length - 2; i++) {
      const patternLength = i - (this.patterns.length > 0 ? this.patterns[this.patterns.length - 1].index : 0);

      Object.keys(this.patternsMapping).forEach((patternName) => {
        const patternFunc = this.patternsMapping[patternName];
        if (patternFunc(i)) {
          this.patterns.push({ index: i, type: patternName, length: patternLength });
        }
      });
    }

    return this.patterns;
  }

  isValidNumber(value) {
    return !isNaN(value) && isFinite(value);
  }

  isDescendingTriangle(i) {
    if (i < 2 || i >= this.prices.length - 2) return false;

    const lowerHigh = this.prices[i - 1];
    const currentHigh = this.prices[i];
    const support = this.prices[i - 2];

    const isLowerHigh = currentHigh < lowerHigh;
    const isSupport = Math.abs(support - this.prices[i - 3]) / this.prices[i - 3] <= this.options.threshold;

    return isLowerHigh && isSupport;
  }

  isRectangleTriangle(i) {
    if (i < 3 || i >= this.prices.length - 3) return false;

    const high1 = this.prices[i - 3];
    const high2 = this.prices[i - 1];
    const low1 = this.prices[i - 2];
    const low2 = this.prices[i];

    const isHighResistance = Math.abs(high1 - high2) / high2 <= this.options.threshold;
    const isLowSupport = Math.abs(low1 - low2) / low2 <= this.options.threshold;

    return isHighResistance && isLowSupport;
  }

  isHeadAndShoulders(i) {
    if (i < 2 || i >= this.prices.length - 2) return false;

    const leftShoulder = this.prices[i - 2];
    const head = this.prices[i - 1];
    const rightShoulder = this.prices[i];
    const leftTrough = this.prices[i - 3];
    const rightTrough = this.prices[i + 1];

    return (
      head > leftShoulder &&
      head > rightShoulder &&
      Math.abs(leftShoulder - rightShoulder) / rightShoulder <= this.options.threshold &&
      Math.abs(leftTrough - rightTrough) / rightTrough <= this.options.threshold
    );
  }

  isInverseHeadAndShoulders(i) {
    if (i < 2 || i >= this.prices.length - 2) return false;

    const leftShoulder = this.prices[i - 2];
    const head = this.prices[i - 1];
    const rightShoulder = this.prices[i];
    const leftPeak = this.prices[i - 3];
    const rightPeak = this.prices[i + 1];

    return (
      head < leftShoulder &&
      head < rightShoulder &&
      Math.abs(leftShoulder - rightShoulder) / rightShoulder <= this.options.threshold &&
      Math.abs(leftPeak - rightPeak) / rightPeak <= this.options.threshold
    );
  }

  isFlag(i) {
    if (i < 3 || i >= this.prices.length - 2) return false;

    const previousPrice = this.prices[i - 1];
    const currentPrice = this.prices[i];
    const nextPrice = this.prices[i + 1];

    const isFlagPole =
      Math.abs(previousPrice - this.prices[i - 2]) / this.prices[i - 2] > this.options.threshold &&
      Math.abs(this.volume[i - 1] - this.volume[i - 2]) / this.volume[i - 2] > this.options.volumeThreshold;
    const isFlagBody =
      Math.abs(currentPrice - previousPrice) / previousPrice <= this.options.threshold &&
      Math.abs(currentPrice - nextPrice) / currentPrice <= this.options.threshold;

    const isRSIInRange = this.rsi[i - 1] >= this.options.rsiThreshold && this.rsi[i - 1] <= 100 - this.options.rsiThreshold;

    return isFlagPole && isFlagBody && isRSIInRange;
  }

  isDoubleBottom(i) {
    const currentPrice = this.prices[i];
    const previousPrice = this.prices[i - 1];
    const nextPrice = this.prices[i + 1];

    return (
      Math.abs(currentPrice - previousPrice) / previousPrice <= this.options.threshold &&
      Math.abs(currentPrice - nextPrice) / currentPrice <= this.options.threshold &&
      currentPrice < previousPrice &&
      currentPrice < nextPrice
    );
  }

  isDoubleTop(i) {
    const currentPrice = this.prices[i];
    const previousPrice = this.prices[i - 1];
    const nextPrice = this.prices[i + 1];

    return (
      Math.abs(currentPrice - previousPrice) / previousPrice <= this.options.threshold &&
      Math.abs(currentPrice - nextPrice) / currentPrice <= this.options.threshold &&
      currentPrice > previousPrice &&
      currentPrice > nextPrice
    );
  }

  isTriangle(i, type) {
    const currentPrice = this.prices[i];
    const previousPrice = this.prices[i - 1];
    const nextPrice = this.prices[i + 1];

    const isSymmetrical =
      Math.abs(previousPrice - nextPrice) / previousPrice <= this.options.threshold &&
      currentPrice !== previousPrice &&
      currentPrice !== nextPrice;

    const isAscending = currentPrice > previousPrice && currentPrice < nextPrice;
    const isDescending = currentPrice < previousPrice && currentPrice > nextPrice;

    switch (type) {
      case 'symmetrical':
        return isSymmetrical;
      case 'ascending':
        return isSymmetrical && isAscending;
      case 'descending':
        return isSymmetrical && isDescending;
      default:
        return false;
    }
  }

  calculateRSI() {
    const gainsAndLosses = [];
    for (let i = 1; i < this.prices.length; i++) {
      gainsAndLosses.push(this.prices[i] - this.prices[i - 1]);
    }

    const avgGains = [];
    const avgLosses = [];
    let sumGain = 0;
    let sumLoss = 0;

    for (let i = 0; i < gainsAndLosses.length; i++) {
      sumGain += Math.max(gainsAndLosses[i], 0);
      sumLoss += Math.abs(Math.min(gainsAndLosses[i], 0));

      if (i >= this.options.rsiPeriod) {
        sumGain -= Math.max(gainsAndLosses[i - this.options.rsiPeriod], 0);
        sumLoss -= Math.abs(Math.min(gainsAndLosses[i - this.options.rsiPeriod], 0));
      }

      if (i >= this.options.rsiPeriod - 1) {
        avgGains.push(sumGain / this.options.rsiPeriod);
        avgLosses.push(sumLoss / this.options.rsiPeriod);
      }
    }

    const rsi = [];
    for (let i = 0; i < avgGains.length; i++) {
      const rs = avgGains[i] / avgLosses[i];
      const rsiValue = 100 - 100 / (1 + rs);

      if (this.isValidNumber(rsiValue)) {
        rsi.push(rsiValue);
      } else {
        rsi.push(null);
      }
    }

    return rsi;
  }

}

function analyzePricePatterns(prices, volume, options = {}) {
  const patternAnalyzer = new PatternAnalyzer(prices, volume, options);
  return patternAnalyzer.analyze();
}

export { analyzePricePatterns as analyzePatterns };
