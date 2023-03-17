function patternPerformance(priceData, patterns, lookahead = 5) {
  const performance = {};

  patterns.forEach((pattern) => {
    const { index, type } = pattern;
    const currentPrice = priceData[index].close;

    if (index + lookahead < priceData.length) {
      const futurePrice = priceData[index + lookahead].close;
      const priceChange = (futurePrice - currentPrice) / currentPrice;
      if (!performance[type]) {
        performance[type] = {
          occurrences: 0,
          positive: 0,
          negative: 0,
        };
      }

      performance[type].occurrences++;
      if (priceChange > 0) {
        performance[type].positive++;
      } else if (priceChange < 0) {
        performance[type].negative++;
      }
    }
  });

  Object.keys(performance).forEach((patternType) => {
    const patternData = performance[patternType];
    patternData.positiveRate = patternData.positive / patternData.occurrences;
    patternData.negativeRate = patternData.negative / patternData.occurrences;
  });

  return performance;
}

export { patternPerformance };