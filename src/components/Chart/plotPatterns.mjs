import * as plotly from 'plotly.js-dist';

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

  plotHistoricalData(historicalData, patterns, userInput, options, performanceResults) {
    console.log(performanceResults);
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

    plotly.newPlot(document.getElementById('plot'), data, layout);
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

      patternTraces[pattern.type].x.push(new Date(historicalData[pattern.index].openTime));
      patternTraces[pattern.type].y.push(historicalData[pattern.index].close);

      if (pattern.type === activePattern) {
        patternTraces[pattern.type].text.push(pattern.type);
        patternTraces[pattern.type].marker.opacity = 1;
      } else {
        patternTraces[pattern.type].text.push('');
        patternTraces[pattern.type].marker.opacity = 0;
      }
    });

    return patternTraces;
  }
}

export default Plotter;
