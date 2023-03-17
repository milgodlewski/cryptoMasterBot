==> app.mjs <==
import { getHistoricalData } from "./historicalData.mjs";
import { analyzePatterns } from "./pricePatterns.mjs";
import { patternPerformance } from "./patternPerformance.mjs";
import { plotPatterns } from "./plotPatterns.mjs";

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
  const patterns = analyzePatterns(historicalData, userInput);
  patternPerformance(patterns);
  plotPatterns(historicalData, patterns, userInput);
}

==> config.mjs <==
const config = {
  apiUrl: 'https://api.binance.com',
  apiKey: 'DY02MRdwpEGOlSQncfmcxxYDsCpxrO6ZNzIlF3vh2AY7oKBd0NV7wZXcB9l8WbyQ',
  apiSecret: 'SO6BVKJPb2SQCA8Ex7x3snTEYkMEQmWKChjLfUtb9MUFCYh6ipuMTIPej5rpl0j3',
};

export default config;

==> groupedPatterns.mjs <==
function groupPatternsByType(patterns) {
  const groupedPatterns = {};

  patterns.forEach(pattern => {
    if (!groupedPatterns[pattern.type]) {
      groupedPatterns[pattern.type] = [];
    }
    groupedPatterns[pattern.type].push(pattern.index);
  });

  return groupedPatterns;
}

export { groupPatternsByType };

==> historicalData.mjs <==
import config from './config.mjs';

let axios;
const CORS_PROXY = "http://localhost:8080/";

async function getHistoricalData(symbol, startDate, endDate, interv) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!axios) {
    axios = await import('axios').then(module => module.default);
  }
  try {
    const response = await axios.get(`${CORS_PROXY}https://api.binance.com/api/v3/klines`, {
      params: {
        symbol: symbol,
        interval: interv,
        startTime: start.getTime(),
        endTime: end.getTime(),
        limit: 1000,
      },
      headers: {
        'X-MBX-APIKEY': config.apiKey,
      },
    });

    return response.data.map((entry) => {
      return {
        openTime: entry[0],
        open: parseFloat(entry[1]),
        high: parseFloat(entry[2]),
        low: parseFloat(entry[3]),
        close: parseFloat(entry[4]),
        volume: parseFloat(entry[5]),
        closeTime: entry[6],
      };
    });
  } catch (error) {
    console.error(`Failed to fetch historical data: ${error}`);
    if (error.response) {
      console.error('Error response data:', error.response.data);
    }
    throw error;
  }
}



export { getHistoricalData };