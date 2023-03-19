import { getHistoricalData } from ".././historicalData.mjs";

// Test sprawdzający poprawność pobierania danych historycznych
test("getHistoricalData returns valid historical data", async () => {
  const symbol = "BTCUSDT";
  const startDate = "2021-09-01";
  const endDate = "2021-09-10";
  const interval = "1d";

  const data = await getHistoricalData(symbol, startDate, endDate, interval);

  expect(data).toBeTruthy();
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThan(0);

  // Sprawdzenie poprawności formatu danych
  data.forEach((entry) => {
    expect(entry).toHaveProperty("openTime");
    expect(entry).toHaveProperty("open");
    expect(entry).toHaveProperty("high");
    expect(entry).toHaveProperty("low");
    expect(entry).toHaveProperty("close");
    expect(entry).toHaveProperty("volume");
    expect(entry).toHaveProperty("closeTime");
  });
});

// Test sprawdzający obsługę błędów podczas pobierania danych historycznych
test("getHistoricalData handles errors", async () => {
  const symbol = "INVALIDSYMBOL";
  const startDate = "2021-09-01";
  const endDate = "2021-09-10";
  const interval = "1d";

  await expect(getHistoricalData(symbol, startDate, endDate, interval)).rejects.toThrow();
});

// Dodatkowe testy można dodać w podobny sposób

// Test sprawdzający, czy funkcja getHistoricalData zwraca oczekiwany format danych
test("getHistoricalData returns data in the expected format and sorted by time", async () => {
  const symbol = "BTCUSDT";
  const startDate = "2021-09-01";
  const endDate = "2021-09-10";
  const interval = "1d";

  const data = await getHistoricalData(symbol, startDate, endDate, interval);

  expect(data).toBeTruthy();
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThan(0);

  // Sprawdzenie poprawności formatu danych
  data.forEach((entry) => {
    expect(entry).toHaveProperty("openTime");
    expect(entry).toHaveProperty("open");
    expect(entry).toHaveProperty("high");
    expect(entry).toHaveProperty("low");
    expect(entry).toHaveProperty("close");
    expect(entry).toHaveProperty("volume");
    expect(entry).toHaveProperty("closeTime");
  });

  // Sprawdzenie, czy zwrócone dane są rzeczywiście posortowane według czasu
  for (let i = 1; i < data.length; i++) {
    expect(data[i].openTime).toBeGreaterThan(data[i - 1].openTime);
  }
});


// Test sprawdzający, czy funkcja getHistoricalData radzi sobie z przypadkami brzegowymi
test("getHistoricalData handles edge cases with short and long intervals", async () => {
  const symbol = "BTCUSDT";
  const startDate = "2021-09-01";
  const endDate = "2021-09-10";

  // Przypadek brzegowy: bardzo krótki interwał (1 minuta)
  const shortInterval = "1m";
  const shortData = await getHistoricalData(symbol, startDate, endDate, shortInterval);

  expect(shortData).toBeTruthy();
  expect(Array.isArray(shortData)).toBe(true);
  expect(shortData.length).toBeGreaterThan(0);

  // Przypadek brzegowy: bardzo długi interwał (1 miesiąc)
  const longInterval = "1M";
  const longData = await getHistoricalData(symbol, startDate, endDate, longInterval);

  expect(longData).toBeTruthy();
  expect(Array.isArray(longData)).toBe(true);
  expect(longData.length).toBeGreaterThan(0);
});

// Test sprawdzający, czy funkcja getHistoricalData radzi sobie z różnymi parametrami czasowymi
test("getHistoricalData handles different time ranges", async () => {
  const symbol = "BTCUSDT";
  const interval = "1d";

  // Przypadek: zakres dat obejmuje tylko jeden dzień
  const oneDayStart = "2021-09-01";
  const oneDayEnd = "2021-09-01";
  const oneDayData = await getHistoricalData(symbol, oneDayStart, oneDayEnd, interval);

  expect(oneDayData).toBeTruthy();
  expect(Array.isArray(oneDayData)).toBe(true);
  expect(oneDayData.length).toBeGreaterThan(0);

  // Przypadek: zakres dat obejmuje dłuższy okres (np. rok)
  const oneYearStart = "2020-09-01";
  const oneYearEnd = "2021-09-01";
  const oneYearData = await getHistoricalData(symbol, oneYearStart, oneYearEnd, interval);

  expect(oneYearData).toBeTruthy();
  expect(Array.isArray(oneYearData)).toBe(true);
  expect(oneYearData.length).toBeGreaterThan(0);
});

// Test sprawdzający, czy funkcja getHistoricalData radzi sobie z różnymi symbolami
test("getHistoricalData handles different symbols", async () => {
  const interval = "1d";
  const startDate = "2021-09-01";
  const endDate = "2021-09-10";

  // Przypadek: różne pary walutowe
  const currencyPairs = ["BTCUSDT", "ETHUSDT", "LTCUSDT"];
  for (const symbol of currencyPairs) {
    const currencyPairData = await getHistoricalData(symbol, startDate, endDate, interval);

    expect(currencyPairData).toBeTruthy();
    expect(Array.isArray(currencyPairData)).toBe(true);
    expect(currencyPairData.length).toBeGreaterThan(0);
  }

  // Przypadek: instrumenty inne niż kryptowaluty (np. akcje, indeksy)
  // Uwaga: Upewnij się, że używasz odpowiedniego API lub dostawcy danych, który obsługuje te instrumenty
  const otherInstruments = ["AAPL", "MSFT", "SPX"];
  for (const symbol of otherInstruments) {
    const otherInstrumentData = await getHistoricalData(symbol, startDate, endDate, interval);

    expect(otherInstrumentData).toBeTruthy();
    expect(Array.isArray(otherInstrumentData)).toBe(true);
    expect(otherInstrumentData.length).toBeGreaterThan(0);
  }
});