import config from './config.mjs';

class HistoricalDataFetcher {
  static axios;
  static CORS_PROXY = "http://localhost:8080/";

  static async getHistoricalData(symbol, startDate, endDate, interv) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!this.axios) {
      this.axios = await import('axios').then(module => module.default);
    }
    try {
      const response = await this.axios.get(`${this.CORS_PROXY}https://api.binance.com/api/v3/klines`, {
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
}

export default HistoricalDataFetcher;
