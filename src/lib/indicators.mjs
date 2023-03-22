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
  if (period <= 0 || data.length < period) {
      return [];
  }
  const rsi = [];
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i < period; i++) {
      const change = data[i] - data[i - 1];
      if (change >= 0) {
          avgGain += change;
      } else {
          avgLoss += change;
      }
  }
  avgGain /= period;
  avgLoss /= period;
  avgLoss = Math.abs(avgLoss);
  let rs = avgGain / avgLoss;
  let rsiValue = 100 - (100 / (1 + rs));
  rsi.push(rsiValue);
  for (let i = period; i < data.length; i++) {
      const change = data[i] - data[i - 1];
      let gain = 0;
      let loss = 0;
      if (change >= 0) {
          gain = change;
      } else {
          loss = change;
      }
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      avgLoss = Math.abs(avgLoss);
      rs = avgGain / avgLoss;
      rsiValue = 100 - (100 / (1 + rs));
      rsi.push(rsiValue);
  }
  return rsi;
}


export function calculateMACD(data, shortPeriod, longPeriod, signalPeriod) {
  if (shortPeriod <= 0 || longPeriod <= 0 || signalPeriod <= 0 || data.length < longPeriod) {
    return [];
  }
  const macd = [];
  const emaShort = calculateEMA(data, shortPeriod);
  const emaLong = calculateEMA(data, longPeriod);
  for (let i = 0; i < emaShort.length; i++) {
    macd.push(emaShort[i] - emaLong[i]);
  } 
  const signal = calculateEMA(macd, signalPeriod);
  const histogram = [];
  for (let i = 0; i < macd.length; i++) {
    histogram.push(macd[i] - signal[i]);
  }
}
