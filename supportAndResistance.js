const { analyzeCandlesticks } = require('./candlestickAnalysis');

function findPeaksAndValleys(prices, windowSize) {
  const peaks = [];
  const valleys = [];

  for (let i = windowSize; i < prices.length - windowSize; i++) {
    const left = prices.slice(i - windowSize, i);
    const right = prices.slice(i + 1, i + 1 + windowSize);
    const minLeft = Math.min(...left);
    const maxLeft = Math.max(...left);
    const minRight = Math.min(...right);
    const maxRight = Math.max(...right);

    if (prices[i] > maxLeft && prices[i] > maxRight) {
      peaks.push({ index: i, price: prices[i] });
    } else if (prices[i] < minLeft && prices[i] < minRight) {
      valleys.push({ index: i, price: prices[i] });
    }
  }

  return { peaks, valleys };
}

function clusterLevels(levels, priceRange, minDistance) {
  const clusters = [];

  levels.sort((a, b) => a.price - b.price);

  let currentCluster = [levels[0]];

  for (let i = 1; i < levels.length; i++) {
    const currentPrice = levels[i].price;
    const prevPrice = levels[i - 1].price;

    if (currentPrice - prevPrice < priceRange * minDistance) {
      currentCluster.push(levels[i]);
    } else {
  clusters.push(currentCluster);
  currentCluster = [levels[i]];
}
}

clusters.push(currentCluster);

return clusters.map((cluster) => {
const avgPrice = cluster.reduce((sum, level) => sum + level.price, 0) / cluster.length;
return {
price: avgPrice,
start: cluster[0].index,
end: cluster[cluster.length - 1].index,
};
});
}

function calculateSupportAndResistance(closePrices, windowSize = 10, minDistance = 0.01) {
const { peaks, valleys } = findPeaksAndValleys(closePrices, windowSize);
const supportLevels = clusterLevels(valleys, closePrices, minDistance);
const resistanceLevels = clusterLevels(peaks, closePrices, minDistance);

return { supportLevels, resistanceLevels };
}

module.exports = {
  calculateSupportAndResistance
};