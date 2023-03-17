const config = require('./config');
const axios = require('axios');

async function getHistoricalData(symbol, startDate, endDate, interv) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const response = await axios.get(`${config.apiUrl}/api/v3/klines`, {
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

module.exports = getHistoricalData;