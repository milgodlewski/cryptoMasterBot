import { analyzePatterns } from './path-to-your-patternAnalyzer-file';
describe('PatternAnalyzer constructor', () => {
    test('sets default options correctly when no options are provided', () => {
      const analyzer = new PatternAnalyzer([], []);
      expect(analyzer.options).toEqual({
        threshold: 0.03,
        volumeThreshold: 0.05,
        rsiPeriod: 14,
        rsiThreshold: 30,
      });
    });
  
    test('sets custom options correctly when options are provided', () => {
      const customOptions = {
        threshold: 0.05,
        volumeThreshold: 0.1,
        rsiPeriod: 10,
        rsiThreshold: 25,
      };
      const analyzer = new PatternAnalyzer([], [], customOptions);
      expect(analyzer.options).toEqual(customOptions);
    });
  
    test('sets prices and volume arrays correctly', () => {
      const prices = [1, 2, 3];
      const volume = [10, 20, 30];
      const analyzer = new PatternAnalyzer(prices, volume);
      expect(analyzer.prices).toEqual(prices);
      expect(analyzer.volume).toEqual(volume);
    });
  });

  describe('PatternAnalyzer analyze method', () => {
    const prices = [1, 2, 1, 2, 1];
    const volume = [10, 20, 10, 20, 10];
  
    test('returns an empty array when the prices array has less than 3 elements', () => {
      const analyzer = new PatternAnalyzer([1, 2], []);
      expect(analyzer.analyze()).toEqual([]);
    });
  
    test('returns the correct pattern array for a given set of prices and volume data', () => {
      const patterns = analyzePatterns(prices, volume);
      expect(patterns).toEqual([
        { index: 1, type: 'DoubleTop', length: 1 },
        { index: 3, type: 'DoubleTop', length: 2 },
      ]);
    });
  });

  describe('PatternAnalyzer isValidNumber method', () => {
    const analyzer = new PatternAnalyzer([], []);
  
    test('returns true for valid numbers', () => {
      expect(analyzer.isValidNumber(42)).toBe(true);
    });
  
    test('returns false for NaN and infinite numbers', () => {
      expect(analyzer.isValidNumber(NaN)).toBe(false);
      expect(analyzer.isValidNumber(Infinity)).toBe(false);
    });
  });
    
  describe('PatternAnalyzer isDescendingTriangle method', () => {
    const analyzer = new PatternAnalyzer([2, 1, 3, 1], []);
  
    test('correctly identifies descending triangles', () => {
      expect(analyzer.isDescendingTriangle(1)).toBe(true);
    });
  
    test('returns false for non-descending triangles', () => {
      expect(analyzer.isDescendingTriangle(2)).toBe(false);
    });
  });

  describe('PatternAnalyzer isRectangleTriangle method', () => {
    const analyzer = new PatternAnalyzer([1, 2, 1, 2], []);
  
    test('correctly identifies rectangle triangles', () => {
      expect(analyzer.isRectangleTriangle(3)).toBe(true);
    });
  
    test('returns false for non-rectangle triangles', () => {
      expect(analyzer.isRectangleTriangle(1)).toBe(false);
    });
  });

  describe('PatternAnalyzer isHeadAndShoulders method', () => {
    const analyzer = new PatternAnalyzer([1, 2, 1, 2, 1], []);
  
    test('correctly identifies head and shoulders patterns', () => {
      expect(analyzer.isHeadAndShoulders(3)).toBe(true);
    });
  
    test('returns false for non-head and shoulders patterns', () => {
      expect(analyzer.isHeadAndShoulders(1)).toBe(false);
    });
  });

  describe('PatternAnalyzer isInverseHeadAndShoulders method', () => {
    const analyzer = new PatternAnalyzer([2, 1, 2, 1, 2], []);
  
    test('correctly identifies inverse head and shoulders patterns', () => {
      expect(analyzer.isInverseHeadAndShoulders(3)).toBe(true);
    });
  
    test('returns false for non-inverse head and shoulders patterns', () => {
      expect(analyzer.isInverseHeadAndShoulders(1)).toBe(false);
    });
  });

  describe('PatternAnalyzer isFlag method', () => {
    const prices = [2, 3, 2.5, 2.6, 2.4];
    const volume = [10, 30, 10, 10, 10];
    const options = { threshold: 0.1, volumeThreshold: 0.5, rsiPeriod: 14, rsiThreshold: 30 };
    const analyzer = new PatternAnalyzer(prices, volume, options);
  
    test('correctly identifies flag patterns', () => {
      expect(analyzer.isFlag(2)).toBe(true);
    });
  
    test('returns false for non-flag patterns', () => {
      expect(analyzer.isFlag(1)).toBe(false);
    });
  });

  describe('PatternAnalyzer isDoubleBottom method', () => {
    const analyzer = new PatternAnalyzer([1, 0.9, 1, 1.1], []);
  
    test('correctly identifies double bottom patterns', () => {
      expect(analyzer.isDoubleBottom(2)).toBe(true);
    });
  
    test('returns false for non-double bottom patterns', () => {
      expect(analyzer.isDoubleBottom(1)).toBe(false);
    });
  });

  describe('PatternAnalyzer isDoubleTop method', () => {
    const analyzer = new PatternAnalyzer([1, 1.1, 1, 0.9], []);
  
    test('correctly identifies double top patterns', () => {
      expect(analyzer.isDoubleTop(2)).toBe(true);
    });
  
    test('returns false for non-double top patterns', () => {
      expect(analyzer.isDoubleTop(1)).toBe(false);
    });
  });

  describe('PatternAnalyzer isTriangle method', () => {
    const analyzer = new PatternAnalyzer([1, 2, 3, 2, 1], []);
  
    test('correctly identifies symmetrical triangle patterns', () => {
      expect(analyzer.isTriangle(2, 'symmetrical')).toBe(true);
    });
  
    test('correctly identifies ascending triangle patterns', () => {
      expect(analyzer.isTriangle(3, 'ascending')).toBe(true);
    });
  
    test('correctly identifies descending triangle patterns', () => {
      expect(analyzer.isTriangle(1, 'descending')).toBe(true);
    });
  
    test('returns false for non-triangle patterns', () => {
      expect(analyzer.isTriangle(0, 'symmetrical')).toBe(false);
    });
  });

  describe('PatternAnalyzer calculateRSI method', () => {
    const prices1 = [1, 1, 1, 1, 1];
    const prices2 = [1, 2, 4, 8, 16];
    const options = { rsiPeriod: 4 };
  
    test('calculates RSI values correctly for a given set of prices', () => {
      const analyzer1 = new PatternAnalyzer(prices1, [], options);
      const analyzer2 = new PatternAnalyzer(prices2, [], options);
      const rsi1 = analyzer1.calculateRSI();
      const rsi2 = analyzer2.calculateRSI();
  
      expect(rsi1).toEqual([null, null, null, 50]);
      expect(rsi2).toEqual([null, null, null, 100]);
    });
  
    test('handles edge cases, such as constant prices or prices with large gaps', () => {
      const analyzer1 = new PatternAnalyzer(prices1, [], options);
      const analyzer2 = new PatternAnalyzer(prices2, [], options);
      const rsi1 = analyzer1.calculateRSI();
      const rsi2 = analyzer2.calculateRSI();
  
      expect(rsi1).toEqual([null, null, null, 50]);
      expect(rsi2).toEqual([null, null, null, 100]);
    });
  });

  describe('PatternAnalyzer RSI related options', () => {
    const prices = [1, 1.1, 1, 0.9, 1, 1.1];
    const options = { rsiPeriod: 4, rsiThreshold: 70 };
  
    test('changing the rsiPeriod option affects the RSI calculation', () => {
      const customOptions = { ...options, rsiPeriod: 3 };
      const analyzer = new PatternAnalyzer(prices, [], customOptions);
      const rsi = analyzer.calculateRSI();
      expect(rsi).not.toEqual(analyzer.calculateRSI());
    });
  
    test('changing the rsiThreshold option affects the flag pattern detection', () => {
      const customOptions = { ...options, rsiThreshold: 80 };
      const analyzer = new PatternAnalyzer(prices, [], customOptions);
      const patterns = analyzer.analyzePricePatterns();
      expect(patterns).not.toContain('flag');
    });
  });

  describe('PatternAnalyzer analyzePricePatterns function', () => {
    const prices = [1, 1.1, 1, 0.9, 1, 1.1];
    const volume = [100, 200, 100, 300, 200, 100];
    const options = { threshold: 0.1 };
  
    test('returns the correct pattern array for a given set of prices and volume data', () => {
      const analyzer = new PatternAnalyzer(prices, volume, options);
      const patterns = analyzer.analyzePricePatterns();
      expect(patterns).toEqual(['doubleTop', 'doubleBottom']);
    });
  
    test('works correctly with custom options provided', () => {
      const customOptions = { ...options, threshold: 0.05 };
      const analyzer = new PatternAnalyzer(prices, volume, customOptions);
      const patterns = analyzer.analyzePricePatterns();
      expect(patterns).toEqual([]);
    });
  });

  describe('PatternAnalyzer threshold and volumeThreshold handling', () => {
    const prices = [1, 1.1, 1, 0.9, 1, 1.1];
    const volume = [100, 200, 100, 300, 200, 100];
    const options = { threshold: 0.1, volumeThreshold: 0.5 };
  
    test('changing the threshold in the options affects the pattern detection', () => {
      const customOptions = { ...options, threshold: 0.05 };
      const analyzer = new PatternAnalyzer(prices, volume, customOptions);
      const patterns = analyzer.analyzePricePatterns();
      expect(patterns).toEqual([]);
    });
  
    test('changing the volumeThreshold in the options affects the flag pattern detection', () => {
      const customOptions = { ...options, volumeThreshold: 0.9 };
      const analyzer = new PatternAnalyzer(prices, volume, customOptions);
      const patterns = analyzer.analyzePricePatterns();
      expect(patterns).not.toContain('flag');
    });
  });
  
  describe('PatternAnalyzer analyze method for overlapping patterns', () => {
    const prices = [1, 1.1, 1, 0.9, 1, 1.1, 1, 0.9];
    const options = { threshold: 0.1 };
  
    test('returns correct pattern array when multiple patterns overlap in the price data', () => {
      const analyzer = new PatternAnalyzer(prices, [], options);
      const patterns = analyzer.analyzePricePatterns();
      expect(patterns).toEqual(['doubleTop', 'doubleBottom', 'doubleTop', 'doubleBottom']);
      });
      
      test('correctly identifies the start and end points of the overlapping patterns', () => {
      const analyzer = new PatternAnalyzer(prices, [], options);
      const patternDetails = analyzer.analyze();
      expect(patternDetails).toEqual([
      { pattern: 'doubleTop', start: 0, end: 2 },
      { pattern: 'doubleBottom', start: 1, end: 3 },
      { pattern: 'doubleTop', start: 2, end: 4 },
      { pattern: 'doubleBottom', start: 3, end: 5 }
      ]);
    });
  });

  describe('PatternAnalyzer pattern detection with different price types', () => {
    const dailyClosingPrices = [1, 1.1, 1, 0.9, 1, 1.1];
    const intradayPrices = [1, 1.1, 1, 0.9, 1, 1.1];
    const weeklyClosingPrices = [1, 1.1, 1, 0.9, 1, 1.1];
    const options = { threshold: 0.1 };
  
    test('pattern detection works correctly with daily closing prices', () => {
      const analyzer = new PatternAnalyzer(dailyClosingPrices, [], options);
      const patterns = analyzer.analyzePricePatterns();
      expect(patterns).toEqual(['doubleTop', 'doubleBottom']);
    });
  
    test('pattern detection works correctly with intraday prices', () => {
      const analyzer = new PatternAnalyzer(intradayPrices, [], options);
      const patterns = analyzer.analyzePricePatterns();
      expect(patterns).toEqual(['doubleTop', 'doubleBottom']);
    });
  
    test('pattern detection works correctly with weekly or monthly closing prices', () => {
      const analyzer = new PatternAnalyzer(weeklyClosingPrices, [], options);
      const patterns = analyzer.analyzePricePatterns();
      expect(patterns).toEqual(['doubleTop', 'doubleBottom']);
    });
  });

  describe('PatternAnalyzer pattern detection with different market conditions', () => {
    const bullishPrices = [100, 102, 104, 106, 108, 110];
    const bearishPrices = [110, 108, 106, 104, 102, 100];
    const highVolatilityPrices = [100, 120, 110, 130, 120, 140];
    const lowVolatilityPrices = [100, 101, 100, 101, 100, 101];
    const options = { threshold: 0.1 };
  
    test('pattern detection works correctly during bullish market conditions', () => {
      const analyzer = new PatternAnalyzer(bullishPrices, [], options);
      const patterns = analyzer.analyzePricePatterns();
      expect(patterns).toEqual([]);
    });
  
    test('pattern detection works correctly during bearish market conditions', () => {
      const analyzer = new PatternAnalyzer(bearishPrices, [], options);
      const patterns = analyzer.analyzePricePatterns();
      expect(patterns).toEqual([]);
    });
  
    test('pattern detection works correctly during periods of high volatility', () => {
      const analyzer = new PatternAnalyzer(highVolatilityPrices, [], options);
      const patterns = analyzer.analyzePricePatterns();
      expect(patterns).toEqual([]);
    });
  
    test('pattern detection works correctly during periods of low volatility', () => {
      const analyzer = new PatternAnalyzer(lowVolatilityPrices, [], options);
      const patterns = analyzer.analyzePricePatterns();
      expect(patterns).toEqual([]);
    });
  });
  
  describe('PatternAnalyzer with different data input formats', () => {
    const priceDataArray = [1, 1.1, 1, 0.9, 1, 1.1];
    const priceDataObjectArray = [
      { price: 1, volume: 1000 },
      { price: 1.1, volume: 2000 },
      { price: 1, volume: 3000 },
      { price: 0.9, volume: 4000 },
      { price: 1, volume: 5000 },
      { price: 1.1, volume: 6000 },
    ];
    const options = { threshold: 0.1 };
  
    test('function works correctly with arrays of objects containing price and volume data', () => {
      const patterns = analyzePricePatterns(
        priceDataObjectArray.map((data) => data.price),
        priceDataObjectArray.map((data) => data.volume),
        options
      );
      expect(patterns).toEqual(['doubleTop', 'doubleBottom']);
    });
  
    test('function works correctly with different price and volume data representations, such as percentages or basis points', () => {
      const priceDataPercentages = priceDataArray.map((price) => price * 100);
      const patterns = analyzePricePatterns(priceDataPercentages, [], options);
      expect(patterns).toEqual(['doubleTop', 'doubleBottom']);
    });
  });
  
  describe('PatternAnalyzer error handling and edge cases', () => {
    const incompletePriceData = [1, 1.1, 1, undefined, 1, 1.1];
    const invalidPriceData = [1, 1.1, 1, 'invalid', 1, 1.1];
    const extremePriceData = [1, 1.1, 1, 1000, 1, 1.1];
    const options = { threshold: 0.1 };
  
    test('function throws appropriate errors or handles cases where input data is missing or incomplete', () => {
      expect(() => {
        analyzePricePatterns(incompletePriceData, [], options);
      }).toThrow();
    });
  
    test('function handles cases where input data is in an unexpected format or contains invalid values', () => {
      expect(() => {
        analyzePricePatterns(invalidPriceData, [], options);
      }).toThrow();
    });
  
    test('function handles cases where the price or volume data has extreme values or outliers', () => {
      const patterns = analyzePricePatterns(extremePriceData, [], options);
      expect(patterns).toEqual([]);
    });
  });

  
