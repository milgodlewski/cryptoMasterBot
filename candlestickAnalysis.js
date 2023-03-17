function analyzeCandlesticks(priceData, threshold = 0.001) {
  const results = [];

  for (let i = 1; i < priceData.length; i++) {
    const { open, high, low, close } = priceData[i];
    const realBody = Math.abs(close - open);
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;

    const isMarubozu = upperShadow <= threshold && lowerShadow <= threshold;
    const isHammer = upperShadow / lowerShadow >= 2 && realBody / (high - low) <= 0.5;
    const isShootingStar = lowerShadow / upperShadow >= 2 && realBody / (high - low) <= 0.5;

    if (isMarubozu) {
      results.push({ index: i, type: 'Marubozu' });
    } else if (isHammer) {
      results.push({ index: i, type: 'Hammer' });
    } else if (isShootingStar) {
      results.push({ index: i, type: 'Shooting Star' });
    }
  }

  return results;
}

module.exports = {
  analyzeCandlesticks
};
