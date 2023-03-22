import HistoricalFetcher from '../HistoricalFetcher.mjs';

test('HistoricalFetcher class should exist', () => {
  expect(HistoricalFetcher).toBeDefined();
});

import axios from 'axios';
import HistoricalFetcher from '../HistoricalFetcher.mjs';

jest.mock('axios');

test('getHistoricalData should fetch data properly with correct parameters', async () => {
  const symbol = 'BTCUSDT';
  const startDate = '2020-01-01';
  const endDate = '2020-01-10';
  const interval = '1d';

  axios.get.mockResolvedValue({
    data: [
      [
        1577836800000,
        '1000.00000000',
        '1010.00000000',
        '990.00000000',
        '1005.00000000',
        '1500.00000000',
        1577923199999,
      ],
    ],
  });

  const historicalData = await HistoricalFetcher.getHistoricalData(symbol, startDate, endDate, interval);

  expect(axios.get).toHaveBeenCalledTimes(1);
  expect(historicalData).toEqual([
    {
      openTime: 1577836800000,
      open: 1000,
      high: 1010,
      low: 990,
      close: 1005,
      volume: 1500,
      closeTime: 1577923199999,
    },
  ]);
});


import axios from 'axios';
import HistoricalFetcher from '../HistoricalFetcher.mjs';

jest.mock('axios');

test('getHistoricalData should throw an error if the API request fails', async () => {
  const symbol = 'BTCUSDT';
  const startDate = '2020-01-01';
  const endDate = '2020-01-10';
  const interval = '1d';

  axios.get.mockRejectedValue(new Error('API request failed'));

  await expect(HistoricalFetcher.getHistoricalData(symbol, startDate, endDate, interval)).rejects.toThrow('API request failed');
});
import axios from 'axios';
import HistoricalFetcher from '../HistoricalFetcher.mjs';

jest.mock('axios');

test('getHistoricalData should throw an error if provided an invalid symbol', async () => {
  const symbol = 'INVALID';
  const startDate = '2020-01-01';
  const endDate = '2020-01-10';
  const interval = '1d';

  axios.get.mockRejectedValue({
    response: {
      data: {
        msg: 'Invalid symbol.',
      },
    },
  });

  await expect(HistoricalFetcher.getHistoricalData(symbol, startDate, endDate, interval)).rejects.toThrow('Invalid symbol.');
});

import axios from 'axios';
import HistoricalFetcher from '../HistoricalFetcher.mjs';

jest.mock('axios');

test('getHistoricalData should throw an error if provided an invalid date range', async () => {
  const symbol = 'BTCUSDT';
  const startDate = '2020-01-10';
  const endDate = '2020-01-01';
  const interval = '1d';

  axios.get.mockRejectedValue({
    response: {
      data: {
        msg: 'Invalid date range.',
      },
    },
  });

  await expect(HistoricalFetcher.getHistoricalData(symbol, startDate, endDate, interval)).rejects.toThrow('Invalid date range.');
});

import axios from 'axios';
import HistoricalFetcher from '../HistoricalFetcher.mjs';

jest.mock('axios');

test('getHistoricalData should throw an error if provided an invalid interval', async () => {
  const symbol = 'BTCUSDT';
  const startDate = '2020-01-01';
  const endDate = '2020-01-10';
  const interval = 'INVALID';

  axios.get.mockRejectedValue({
    response: {
      data: {
        msg: 'Invalid interval.',
      },
    },
  });

  await expect(HistoricalFetcher.getHistoricalData(symbol, startDate, endDate, interval)).rejects.toThrow('Invalid interval.');
});

import axios from 'axios';
import HistoricalFetcher from '../HistoricalFetcher.mjs';

jest.mock('axios');

test('getHistoricalData should return an empty array if no data is available for the specified date range', async () => {
  const symbol = 'BTCUSDT';
  const startDate = '2020-01-01';
  const endDate = '2020-01-02';
  const interval = '1d';

  axios.get.mockResolvedValue({ data: [] });

  const historicalData = await HistoricalFetcher.getHistoricalData(symbol, startDate, endDate, interval);

  expect(historicalData).toEqual([]);
});

import axios from 'axios';
import HistoricalFetcher from '../HistoricalFetcher.mjs';

jest.mock('axios');

test('getHistoricalData should call axios.get with the correct parameters', async () => {
  const symbol = 'BTCUSDT';
  const startDate = '2020-01-01';
  const endDate = '2020-01-10';
  const interval = '1d';
  const apiKey = 'your-api-key';
  
  axios.get.mockResolvedValue({ data: [] });

  await HistoricalFetcher.getHistoricalData(symbol, startDate, endDate, interval);

  expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://api.binance.com/api/v3/klines'), expect.objectContaining({
    params: {
      symbol: symbol,
      interval: interval,
      startTime: new Date(startDate).getTime(),
      endTime: new Date(endDate).getTime(),
      limit: 1000,
    },
    headers: {
      'X-MBX-APIKEY': apiKey,
    },
  }));
});

import axios from 'axios';
import HistoricalFetcher from '../HistoricalFetcher.mjs';

jest.mock('axios');

test('getHistoricalData should throw an error if provided an invalid API key', async () => {
  const symbol = 'BTCUSDT';
  const startDate = '2020-01-01';
  const endDate = '2020-01-10';
  const interval = '1d';

  axios.get.mockRejectedValue({
    response: {
      data: {
        msg: 'Invalid API-key.',
      },
    },
  });

  await expect(HistoricalFetcher.getHistoricalData(symbol, startDate, endDate, interval)).rejects.toThrow('Invalid API-key.');
});

import axios from 'axios';
import HistoricalFetcher from '../HistoricalFetcher.mjs';

jest.mock('axios');

test('getHistoricalData should return data in the expected format', async () => {
  const symbol = 'BTCUSDT';
  const startDate = '2020-01-01';
  const endDate = '2020-01-10';
  const interval = '1d';

  const mockResponseData = [
    [1577836800000, '7195.24000000', '7255.00000000', '7170.92000000', '7210.00000000', '42307.33934000', 1577923199999],
  ];

  const expectedResult = [
    {
      openTime: 1577836800000,
      open: 7195.24,
      high: 7255,
      low: 7170.92,
      close: 7210,
      volume: 42307.33934,
      closeTime: 1577923199999,
    },
  ];

  axios.get.mockResolvedValue({ data: mockResponseData });

  const historicalData = await HistoricalFetcher.getHistoricalData(symbol, startDate, endDate, interval);

  expect(historicalData).toEqual(expectedResult);
});

import axios from 'axios';
import HistoricalFetcher from '../HistoricalFetcher.mjs';

jest.mock('axios');

test('getHistoricalData should throw an error if API response is malformed', async () => {
  const symbol = 'BTCUSDT';
  const startDate = '2020-01-01';
  const endDate = '2020-01-10';
  const interval = '1d';

  const malformedResponseData = [
    ['malformed', 'data'],
  ];

  axios.get.mockResolvedValue({ data: malformedResponseData });

  await expect(HistoricalFetcher.getHistoricalData(symbol, startDate, endDate, interval)).rejects.toThrow('API response is malformed');
});

test('getHistoricalData - poprawne wywołanie z minimalnymi danymi', async () => {
    axios.get.mockResolvedValue({
      data: [
        [1629216000000, '1.0000', '1.0001', '0.9999', '1.0000', '1000', 1629219599999],
      ],
    });

    const data = await HistoricalFetcher.getHistoricalData('BTCUSDT', '2021-08-18', '2021-08-19', '1h');
    expect(data).toHaveLength(1);
    expect(data[0]).toEqual({
      openTime: 1629216000000,
      open: 1.0000,
      high: 1.0001,
      low: 0.9999,
      close: 1.0000,
      volume: 1000,
      closeTime: 1629219599999,
    });
  });

  test('getHistoricalData - sprawdzenie, czy parametry są przekazywane poprawnie do API', async () => {
    axios.get.mockResolvedValue({ data: [] });
    const symbol = 'BTCUSDT';
    const startDate = '2021-08-18';
    const endDate = '2021-08-19';
    const interval = '1h';

    await HistoricalFetcher.getHistoricalData(symbol, startDate, endDate, interval);
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://api.binance.com/api/v3/klines'), expect.objectContaining({
      params: {
        symbol,
        interval,
        startTime: startTimestamp,
        endTime: endTimestamp,
        limit: 1000,
      },
    }));
  });

  test('getHistoricalData - sprawdzenie, czy błąd sieci jest obsługiwany poprawnie', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(HistoricalFetcher.getHistoricalData('BTCUSDT', '2021-08-18', '2021-08-19', '1h')).rejects.toThrow('Network Error');
  });

  test('getHistoricalData - sprawdzenie, czy błąd limitu API jest obsługiwany poprawnie', async () => {
    axios.get.mockRejectedValue({
      response: {
        data: {
          code: -1003,
          msg: 'Too many requests; please use the websocket.',
        },
      },
    });

    await expect(HistoricalFetcher.getHistoricalData('BTCUSDT', '2021-08-18', '2021-08-19', '1h')).rejects.toThrow('Too many requests; please use the websocket.');
  });