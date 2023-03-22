import { patternPerformance } from './PatternPerformance';

describe('PatternPerformance class tests', () => {
  let samplePriceData;
  let samplePatterns;

  beforeEach(() => {
    samplePriceData = [100, 105, 110, 120, 130, 140, 135, 125, 115, 105];
    samplePatterns = [
      { index: 0, type: 'A' },
      { index: 2, type: 'B' },
      { index: 4, type: 'A' },
      { index: 6, type: 'B' },
    ];
  });

  test('Constructor initializes with proper values and default lookahead', () => {
    const performanceAnalyzer = new PatternPerformance(samplePriceData, samplePatterns);
    expect(performanceAnalyzer.priceData).toEqual(samplePriceData);
    expect(performanceAnalyzer.patterns).toEqual(samplePatterns);
    expect(performanceAnalyzer.lookahead).toBe(5);
  });

  test('Constructor initializes with proper values and custom lookahead', () => {
    const performanceAnalyzer = new PatternPerformance(samplePriceData, samplePatterns, 3);
    expect(performanceAnalyzer.priceData).toEqual(samplePriceData);
    expect(performanceAnalyzer.patterns).toEqual(samplePatterns);
    expect(performanceAnalyzer.lookahead).toBe(3);
  });

  test('analyze returns correct results for sample input', () => {
    const expectedOutput = {
      A: {
        occurrences: 2,
        positive: 1,
        negative: 1,
        positiveRate: 0.5,
        negativeRate: 0.5,
      },
      B: {
        occurrences: 1,
        positive: 1,
        negative: 0,
        positiveRate: 1,
        negativeRate: 0,
      },
    };
    expect(patternPerformance(samplePriceData, samplePatterns)).toEqual(expectedOutput);
  });

  test('analyze returns empty object for empty patterns', () => {
    expect(patternPerformance(samplePriceData, [])).toEqual({});
  });

  test('calculatePriceChange returns correct price change value', () => {
    const performanceAnalyzer = new PatternPerformance(samplePriceData, samplePatterns);
    const priceChange = performanceAnalyzer.calculatePriceChange(100, 110);
    expect(priceChange).toBe(0.1);
  });

  test('incrementPatternCounters initializes new pattern type', () => {
    const performanceAnalyzer = new PatternPerformance(samplePriceData, samplePatterns);
    performanceAnalyzer.incrementPatternCounters('C', 1);
    expect(performanceAnalyzer.performance).toEqual({
      C: {
        occurrences: 1,
        positive: 1,
        negative: 0,
      },
    });
  });

  test('incrementPatternCounters increments existing pattern type', () => {
    const performanceAnalyzer = new PatternPerformance(samplePriceData, samplePatterns);
    performanceAnalyzer.performance = {
      C: {
        occurrences: 1,
        positive: 1,
        negative: 0,
      },
    };
    performanceAnalyzer.incrementPatternCounters('C', -1);
    expect(performanceAnalyzer.performance).toEqual({
      C: {
        occurrences: 2,
        positive: 1,
        negative: 1,
      },
    });
  });

  test('calculateRates calculates correct rates for performance data', () => {
    const performanceAnalyzer = new PatternPerformance(samplePriceData, samplePatterns);
    performanceAnalyzer.performance = {
      A: {
        occurrences: 4,
        positive: 2,
        negative: 2,
      },
      B: {
        occurrences: 2,
        positive: 1,
        negative: 1,
      },
    };
    performanceAnalyzer.calculateRates();
    expect(performanceAnalyzer.performance).toEqual({
      A: {
        occurrences: 4,
        positive: 2,
        negative: 2,
        positiveRate: 0.5,
        negativeRate: 0.5,
      },
      B: {
        occurrences: 2,
        positive: 1,
        negative: 1,
        positiveRate: 0.5,
        negativeRate: 0.5,
      },
    });
  });

  test('processPatterns populates performance data correctly', () => {
    const performanceAnalyzer = new PatternPerformance(samplePriceData, samplePatterns);
    performanceAnalyzer.processPatterns();
    expect(performanceAnalyzer.performance).toEqual({
      A: {
        occurrences: 2,
        positive: 1,
        negative: 1,
      },
      B: {
        occurrences: 1,
        positive: 1,
        negative: 0,
      },
    });
  });
});