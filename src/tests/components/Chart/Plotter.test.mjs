import Plotter from "./Plotter.mjs";

describe("Plotter", () => {
  test("should import Plotly correctly", () => {
    const plotter = new Plotter();
    expect(plotter).toBeDefined();
    expect(typeof plotter.plotHistoricalData).toBe("function");
  });
});

import Plotter from './Plotter';

describe('Plotter', () => {
  let plotter;
  
  beforeEach(() => {
    plotter = new Plotter();
  });

  describe('createPerformanceLegend', () => {
    const performance = {
      'patternType1': {
        positiveRate: 0.75,
        totalOccurrences: 4,
      },
      'patternType2': {
        positiveRate: 0.6,
        totalOccurrences: 5,
      },
    };

    test('should create a DOM element with expected performance data', () => {
      const legend = plotter.createPerformanceLegend(performance);
      expect(legend.innerHTML).toContain('Pattern Performance:');
      expect(legend.innerHTML).toContain('patternType1');
      expect(legend.innerHTML).toContain('patternType2');
      expect(legend.innerHTML).toContain('Positive Rate: 0.75');
      expect(legend.innerHTML).toContain('Positive Rate: 0.60');
      expect(legend.innerHTML).toContain('Total Occurrences: 4');
      expect(legend.innerHTML).toContain('Total Occurrences: 5');
    });

    test('should set the DOM element id to performance-legend', () => {
      const legend = plotter.createPerformanceLegend(performance);
      expect(legend.id).toBe('performance-legend');
    });
  });

  describe('getPatternTraces', () => {
    const patterns = [
      { type: 'patternType1', index: 1 },
      { type: 'patternType2', index: 2 },
      { type: 'patternType1', index: 3 },
    ];
    const historicalData = [
      { openTime: new Date('2023-01-01T00:00:00Z'), close: 100 },
      { openTime: new Date('2023-01-02T00:00:00Z'), close: 105 },
      { openTime: new Date('2023-01-03T00:00:00Z'), close: 110 },
      { openTime: new Date('2023-01-04T00:00:00Z'), close: 115 },
    ];
    const performanceResults = {
      patternType1: { positiveRate: 0.75 },
      patternType2: { positiveRate: 0.6 },
    };
    const activePattern = 'patternType1';
  
    test('should return an object with correctly created pattern traces when all patterns are inactive', () => {
      const traces = plotter.getPatternTraces(patterns, historicalData, performanceResults, '');
      expect(traces).toHaveProperty('patternType1');
      expect(traces).    expect(traces).toHaveProperty('patternType2');

      expect(traces.patternType1.x).toEqual([
        new Date('2023-01-02T00:00:00Z'),
        new Date('2023-01-04T00:00:00Z'),
      ]);
      expect(traces.patternType1.y).toEqual([105, 115]);
      expect(traces.patternType1.text).toEqual(['', '']);
      expect(traces.patternType1.marker.opacity).toBe(0);
  
      expect(traces.patternType2.x).toEqual([new Date('2023-01-03T00:00:00Z')]);
      expect(traces.patternType2.y).toEqual([110]);
      expect(traces.patternType2.text).toEqual(['']);
      expect(traces.patternType2.marker.opacity).toBe(0);
    });
  
    test('should return an object with correctly created pattern traces when one pattern is active', () => {
      const traces = plotter.getPatternTraces(patterns, historicalData, performanceResults, activePattern);
      expect(traces).toHaveProperty('patternType1');
      expect(traces).toHaveProperty('patternType2');
  
      expect(traces.patternType1.x).toEqual([
        new Date('2023-01-02T00:00:00Z'),
        new Date('2023-01-04T00:00:00Z'),
      ]);
      expect(traces.patternType1.y).toEqual([105, 115]);
      expect(traces.patternType1.text).toEqual(['patternType1', 'patternType1']);
      expect(traces.patternType1.marker.opacity).toBe(1);
  
      expect(traces.patternType2.x).toEqual([new Date('2023-01-03T00:00:00Z')]);
      expect(traces.patternType2.y).toEqual([110]);
      expect(traces.patternType2.text).toEqual(['']);
      expect(traces.patternType2.marker.opacity).toBe(0);
    });
  });
  

  describe('plotHistoricalData', () => {
    const historicalData = [
      { openTime: new Date('2023-01-01T00:00:00Z'), close: 100 },
      { openTime: new Date('2023-01-02T00:00:00Z'), close: 105 },
      { openTime: new Date('2023-01-03T00:00:00Z'), close: 110 },
      { openTime: new Date('2023-01-04T00:00:00Z'), close: 115 },
    ];
    const patterns = [
      { type: 'patternType1', index: 1 },
      { type: 'patternType2', index: 2 },
      { type: 'patternType1', index: 3 },
    ];
    const userInput = { symbol: 'ABC' };
    const options = { activePattern: 'patternType1' };
    const performanceResults = {
      patternType1: { positiveRate: 0.75 },
      patternType2: { positiveRate: 0.6 },
    };
  
    let plotlySpy;
  
    beforeEach(() => {
        plotlySpy = jest.spyOn(Plotly, 'newPlot').mockImplementation(() => {});
      });
    
      afterEach(() => {
        plotlySpy.mockRestore();
      });
    
      test('should call Plotly.newPlot with the correct parameters', () => {
        const expectedData = [
        ];
        const expectedLayout = {
          title: 'ABC Price History',
          xaxis: { title: 'Time' },
          yaxis: { title: 'Price' },
          showlegend: true,
        };
    
        plotter.plotHistoricalData(historicalData, patterns, userInput, options, performanceResults);
        expect(plotlySpy).toHaveBeenCalledTimes(1);
        expect(plotlySpy).toHaveBeenCalledWith(
          expect.anything(),
          expect.arrayContaining(expectedData),
          expectedLayout
        );
      });
    });

});


  