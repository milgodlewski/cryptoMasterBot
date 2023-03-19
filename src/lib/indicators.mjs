// indicators.mjs

export function calculateMovingAverage(data, period) {
  if (period <= 0 || data.length < period) {
    return [];
  }

  const movingAverages = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j];
    }
    movingAverages.push(sum / period);
  }

  return movingAverages;
}

export function calculateRSI(data, period) {
  // Implementacja obliczania wskaźnika RSI
}

export function calculateMACD(data, shortPeriod, longPeriod, signalPeriod) {
  // Implementacja obliczania wskaźnika MACD
}
