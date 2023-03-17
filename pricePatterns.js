const { calculateSupportAndResistance } = require('./supportAndResistance');
const { analyzeCandlesticks } = require('./candlestickAnalysis');

function isValidNumber(value) {
  return !isNaN(value) && isFinite(value);
}

function analyzePricePatterns(closePrices, volumes, threshold = 0.03, volumeThreshold = 0.05, rsiPeriod = 14, rsiThreshold = 30) {
  const patterns = [];

  const rsi = calculateRSI(closePrices, rsiPeriod);

  for (let i = 1; i < closePrices.length - 2; i++) {
    const patternLength = i - (patterns.length > 0 ? patterns[patterns.length - 1].index : 0);
    if (isDoubleBottom(closePrices, i, threshold)) {
      patterns.push({ index: i, type: 'Double Bottom', length: patternLength });
    } else if (isDoubleTop(closePrices, i, threshold)) {
      patterns.push({ index: i, type: 'Double Top', length: patternLength });
    } else if (isTriangle(closePrices, i, threshold, 'symmetrical')) {
      patterns.push({ index: i, type: 'Symmetrical Triangle', length: patternLength });
    } else if (isTriangle(closePrices, i, threshold, 'ascending')) {
      patterns.push({ index: i, type: 'Ascending Triangle', length: patternLength });
    } else if (isTriangle(closePrices, i, threshold, 'descending')) {
      patterns.push({ index: i, type: 'Descending Triangle', length: patternLength });
    } else if (isFlag(closePrices, volumes, i, threshold, volumeThreshold, rsi, rsiThreshold)) {
      patterns.push({ index: i, type: 'Flag', length: patternLength });
    } else if (isDescendingTriangle(closePrices, i, threshold)) {
      patterns.push({ index: i, type: 'Descending Triangle', length: patternLength });
    } else if (isRectangleTriangle(closePrices, i, threshold)) {
      patterns.push({ index: i, type: 'Rectangle Triangle', length: patternLength });
    }
  }

  return patterns;
}

function isDescendingTriangle(prices, i, threshold) {
  if (i < 2 || i >= prices.length - 2) return false;

  const lowerHigh = prices[i - 1];
  const currentHigh = prices[i];
  const support = prices[i - 2];

  const isLowerHigh = currentHigh < lowerHigh;
  const isSupport = Math.abs(support - prices[i - 3]) / prices[i - 3] <= threshold;

  return isLowerHigh && isSupport;
}

function isRectangleTriangle(prices, i, threshold) {
  if (i < 3 || i >= prices.length - 3) return false;

  const high1 = prices[i - 3];
  const high2 = prices[i - 1];
  const low1 = prices[i - 2];
  const low2 = prices[i];

  const isHighResistance = Math.abs(high1 - high2) / high2 <= threshold;
  const isLowSupport = Math.abs(low1 - low2) / low2 <= threshold;

  return isHighResistance && isLowSupport;
}

function isHeadAndShoulders(prices, i, threshold) {
  if (i < 2 || i >= prices.length - 2) return false;

  const leftShoulder = prices[i - 2];
  const head = prices[i - 1];
  const rightShoulder = prices[i];
  const leftTrough = prices[i - 3];
  const rightTrough = prices[i + 1];

  return (
    head > leftShoulder &&
    head > rightShoulder &&
    Math.abs(leftShoulder - rightShoulder) / rightShoulder <= threshold &&
    Math.abs(leftTrough - rightTrough) / rightTrough <= threshold
  );
}

function isInverseHeadAndShoulders(prices, i, threshold) {
  if (i < 2 || i >= prices.length - 2) return false;

  const leftShoulder = prices[i - 2];
  const head = prices[i - 1];
  const rightShoulder = prices[i];
  const leftPeak = prices[i - 3];
  const rightPeak = prices[i + 1];

  return (
    head < leftShoulder &&
    head < rightShoulder &&
    Math.abs(leftShoulder - rightShoulder) / rightShoulder <= threshold &&
    Math.abs(leftPeak - rightPeak) / rightPeak <= threshold
  );
}

function isFlag(prices, volumes, i, priceThreshold, volumeThreshold, rsi, rsiThreshold) {
  if (i < 3 || i >= prices.length - 2) return false; 

  const previousPrice = prices[i - 1];
  const currentPrice = prices[i];
  const nextPrice = prices[i + 1];

  const isFlagPole =
    Math.abs(previousPrice - prices[i - 2]) / prices[i - 2] > priceThreshold &&
    Math.abs(volumes[i - 1] - volumes[i - 2]) / volumes[i - 2] > volumeThreshold;
  const isFlagBody =
    Math.abs(currentPrice - previousPrice) / previousPrice <= priceThreshold &&
    Math.abs(currentPrice - nextPrice) / currentPrice <= priceThreshold;

  const isRSIInRange = rsi[i - 1] >= rsiThreshold && rsi[i - 1] <= 100 - rsiThreshold;

  return isFlagPole && isFlagBody && isRSIInRange;
}

function isDoubleBottom(prices, i, threshold) {
  const currentPrice = prices[i];
  const previousPrice = prices[i - 1];
  const nextPrice = prices[i + 1];

  return (
    Math.abs(currentPrice - previousPrice) / previousPrice <= threshold &&
    Math.abs(currentPrice - nextPrice) / currentPrice <= threshold &&
    currentPrice < previousPrice &&
    currentPrice < nextPrice
  );
}

function isDoubleTop(prices, i, threshold) {
  const currentPrice = prices[i];
  const previousPrice = prices[i - 1];
  const nextPrice = prices[i + 1];

  return (
    Math.abs(currentPrice - previousPrice) / previousPrice <= threshold &&
    Math.abs(currentPrice - nextPrice) / currentPrice <= threshold &&
    currentPrice > previousPrice &&
    currentPrice > nextPrice
  );
}

function isTriangle(prices, i, threshold, type) {
  const currentPrice = prices[i];
  const previousPrice = prices[i - 1];
  const nextPrice = prices[i + 1];

  const isSymmetrical =
    Math.abs(previousPrice - nextPrice) / previousPrice <= threshold &&
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

function calculateRSI(prices, period) {
  const gainsAndLosses = [];
  for (let i = 1; i < prices.length; i++) {
    gainsAndLosses.push(prices[i] - prices[i - 1]);
  }

  const avgGains = [];
  const avgLosses = [];
  let sumGain = 0;
  let sumLoss = 0;

  for (let i = 0; i < gainsAndLosses.length; i++) {
    sumGain += Math.max(gainsAndLosses[i], 0);
    sumLoss += Math.abs(Math.min(gainsAndLosses[i], 0));

    if (i >= period) {
      sumGain -= Math.max(gainsAndLosses[i - period], 0);
      sumLoss -= Math.abs(Math.min(gainsAndLosses[i - period], 0));
    }

    if (i >= period - 1) {
      avgGains.push(sumGain / period);
      avgLosses.push(sumLoss / period);
    }
  }

  const rsi = [];
  for (let i = 0; i < avgGains.length; i++) {
    const rs = avgGains[i] / avgLosses[i];
    const rsiValue = 100 - 100 / (1 + rs);

    if (isValidNumber(rsiValue)) {
      rsi.push(rsiValue);
    } else {
      rsi.push(null);
    }
  }

  return rsi;
}

module.exports = {
  analyze: analyzePricePatterns,
};