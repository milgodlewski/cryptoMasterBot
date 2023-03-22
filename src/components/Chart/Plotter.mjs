const Plotly = require('plotly.js-dist-min');
class Plotter {
  constructor() {
    this.performanceLegendId = 'performance-legend';
  }

  createPerformanceLegend(performance) {
    const legend = document.createElement('div');
    legend.id = this.performanceLegendId;
    legend.innerHTML = `<h3>Pattern Performance:</h3>`;
    
    Object.entries(performance).forEach(([patternType, patternStats]) => {
      const patternStatsHTML = `
        <div class="pattern-stats">
          <h4>${patternType}:</h4>
          <p>Positive Rate: ${patternStats.positiveRate.toFixed(2)}</p>
          <p>Total Occurrences: ${patternStats.totalOccurrences}</p>
        </div>
      `;
      legend.innerHTML += patternStatsHTML;
    });

    return legend;
  }

  plotHistoricalData({ historicalData, patterns, userInput, options = {}, performanceResults }) {
    const { activePattern } = options;
  
    const trace1 = {
      x: historicalData.map((entry) => new Date(entry.openTime)),
      y: historicalData.map((entry) => entry.close),
      mode: 'lines',
      name: `${userInput.symbol} Price`,
    };
  
    const patternTraces = this.getPatternTraces(patterns, historicalData, performanceResults, activePattern);
  
    const data = [trace1, ...Object.values(patternTraces)];
  
    const layout = {
      title: `${userInput.symbol} Price History`,
      xaxis: { title: 'Time' },
      yaxis: { title: 'Price' },
      showlegend: true,
    };
  
    Plotly.newPlot(document.getElementById('plot'), data, layout);
  }

  getPatternTraces(patterns, historicalData, performanceResults, activePattern) {
    const patternTraces = {};

    patterns.forEach((pattern) => {
      if (!patternTraces[pattern.type]) {
        patternTraces[pattern.type] = {
          x: [],
          y: [],
          text: [],
          mode: 'markers+text',
          textposition: 'top center',
          name: `${pattern.type} (${performanceResults[pattern.type] ? Math.round(performanceResults[pattern.type].positiveRate * 100) / 100 : 'N/A'}%)`,
          marker: { opacity: 0.5 },
        };
      }

      const currentPatternTrace = patternTraces[pattern.type];
      currentPatternTrace.x.push(new Date(historicalData[pattern.index].openTime));
      currentPatternTrace.y.push(historicalData[pattern.index].close);
      currentPatternTrace.text.push(pattern.type === activePattern ? pattern.type : '');
      currentPatternTrace.marker.opacity = pattern.type === activePattern ? 1 : 0;
    });

    return patternTraces;
  }
}

export default Plotter ;

