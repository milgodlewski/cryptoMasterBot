import { getHistoricalData } from "./historicalData.mjs";
import { analyzePatterns } from "./pricePatterns.mjs";
import { patternPerformance } from "./patternPerformance.mjs";
import { plotHistoricalData } from "./plotPatterns.mjs";

document.getElementById("user-input-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const symbol = document.getElementById("symbol").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const interval = document.getElementById("interval").value;

  await main(symbol, startDate, endDate, interval);
});

async function main(symbol, startDate, endDate, interval) {
  const historicalData = await getHistoricalData(symbol, startDate, endDate, interval);
  const userInput = { symbol, startDate, endDate, interval };
  const prices = historicalData.map((entry) => entry.close);
  const volumes = historicalData.map((entry) => entry.volume);
  const patterns = analyzePatterns(prices, volumes);
  const performance = patternPerformance(historicalData, patterns); // Zaktualizowane
  const bestPattern = selectBestPattern(performance);

  const options = {
    activePattern: bestPattern,
  };

  plotHistoricalData(historicalData, patterns, userInput, options);
}


function selectBestPattern(patternPerformanceResults) {
  let bestPattern = null;
  let bestPositiveRate = -Infinity;

  Object.keys(patternPerformanceResults).forEach((patternType) => {
    const positiveRate = patternPerformanceResults[patternType].positiveRate;
    if (positiveRate > bestPositiveRate) {
      bestPositiveRate = positiveRate;
      bestPattern = patternType;
    }
  });

  return bestPattern;
}
