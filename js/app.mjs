import HistoricalDataFetcher from "./historicalData.mjs";
import { analyzePatterns } from "./pricePatterns.mjs";
import { patternPerformance } from "./patternPerformance.mjs";
import Plotter from "./plotPatterns.mjs"; // Zmieniony import

document.getElementById("user-input-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const symbol = document.getElementById("symbol").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const interval = document.getElementById("interval").value;

  await main(symbol, startDate, endDate, interval);
});

async function main(symbol, startDate, endDate, interval) {
  const historicalData = await HistoricalDataFetcher.getHistoricalData(symbol, startDate, endDate, interval);
  const userInput = { symbol, startDate, endDate, interval };
  const prices = historicalData.map((entry) => entry.close);
  const volumes = historicalData.map((entry) => entry.volume);
  const patterns = analyzePatterns(prices, volumes);
  const performanceResults = patternPerformance(prices, patterns);
  const activePattern = selectBestPattern(performanceResults);

  const options = {
    activePattern
  };

  const plotter = new Plotter();
  
  plotter.plotHistoricalData(historicalData, patterns, userInput, options, performanceResults);
}

function selectBestPattern(performanceResults) {
  let bestPattern = null;
  let bestPositiveRate = -Infinity;

  Object.keys(performanceResults).forEach((patternType) => {
    const positiveRate = performanceResults[patternType].positiveRate;
    if (positiveRate > bestPositiveRate) {
      bestPositiveRate = positiveRate;
      bestPattern = patternType;
    }
  });

  return bestPattern;
}
