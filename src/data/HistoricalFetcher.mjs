/**
 * @module HistoricalFetcher
 */

import axios from 'axios';
import appConfig from '../config/appConfig.mjs'; 
import binanceAccessConfig from '../config/binanceAccessConfig.mjs';

/**
 * HistoricalFetcher class provides a static method to fetch historical data from the Binance API.
 * @class
 */
class HistoricalFetcher {
   /**
   * Fetches historical data for the given symbol, date range, and time interval from the Binance API.
   * @param {string} symbol - The trading pair symbol, e.g., 'BTCUSDT'.
   * @param {string} startDate - The start date of the data range in format 'YYYY-MM-DD'.
   * @param {string} endDate - The end date of the data range in format 'YYYY-MM-DD'.
   * @param {string} timeInterval - The time interval for the historical data, e.g., '1m', '3m', '1h', '1d'.
   * @return {Promise<Array<Object>>} An array of historical data objects with the following properties:
   *   - openTime {number}: The opening time of the candlestick in milliseconds since the Unix epoch.
   *   - open {number}: The opening price of the candlestick.
   *   - high {number}: The highest price during the time interval of the candlestick.
   *   - low {number}: The lowest price during the time interval of the candlestick.
   *   - close {number}: The closing price of the candlestick.
   *   - volume {number}: The trading volume during the time interval of the candlestick.
   *   - closeTime {number}: The closing time of the candlestick in milliseconds since the Unix epoch.
   * @throws {Error} If an error occurs while fetching the data from the Binance API.
   */
  static async getHistoricalData(symbol, startDate, endDate, timeInterval) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let responseData;
    
    try {
      const response = await axios.get(`${appConfig.corsProxy}https://api.binance.com/api/v3/klines`, {
        params: {
          symbol: symbol,
          interval: timeInterval,
          startTime: start.getTime(),
          endTime: end.getTime(),
          limit: 1000,
        },
        headers: {
          'X-MBX-APIKEY': binanceAccessConfig.apiKey,
        },
      });
      responseData = response.data;
    } catch (error) {
      console.error(`Failed to fetch historical data: ${error}`);
      if (error.response) {
        console.error(`Error response status: ${error.response.status}`);
        console.error('Error response data:', error.response.data);
      }
      throw error;
    }
    
    return responseData.map((entry) => {
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
  }
}

export default HistoricalFetcher;
