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


  clear() {
    const plotElement = document.getElementById('plot');
    Plotly.purge(plotElement);
  }
  
  updatePlot(data, layout) {
    const plotElement = document.getElementById('plot');
    Plotly.update(plotElement, data, layout);
  }
  
  plotHistoricalData({ historicalData, patterns, userInput, options = {}, performanceResults }) {
    this.clear();
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
    
    const plotElement = document.getElementById('plot');
    if (plotElement.data && plotElement.data.length > 0) {
      this.updatePlot(data, layout);
    } else {
      Plotly.newPlot(plotElement, data, layout);
    }
  }
  
  getPatternTraces(patterns, historicalData, performanceResults, activePattern) {
    const patternTraces = {};
    
    patterns.forEach((pattern) => {
      if (!patternTraces[pattern.type]) {
        patternTraces[pattern.type] = {
          x: [],
          y: [],
          mode: 'markers',
          textposition: 'none',
          name: `${pattern.type} (${performanceResults[pattern.type] ? Math.round(performanceResults[pattern.type].positiveRate * 100) / 100 : 'N/A'}%)`,
          marker: { opacity: 0.5 },
        };
      }
      
      const currentPatternTrace = patternTraces[pattern.type];
      currentPatternTrace.x.push(new Date(historicalData[pattern.index].openTime));
      currentPatternTrace.y.push(historicalData[pattern.index].close);
      currentPatternTrace.marker.opacity = pattern.type === activePattern ? 1 : 0;
    });
    
    return patternTraces;
  }
  
}
export default Plotter ;

