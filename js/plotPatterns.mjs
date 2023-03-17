import * as plotly from 'plotly.js-dist';

function plotHistoricalData(historicalData, patterns, userInput, options) {
  const { activePattern } = options;

  const trace1 = {
    x: historicalData.map((entry) => new Date(entry.openTime)),
    y: historicalData.map((entry) => entry.close),
    mode: 'lines',
    name: `${userInput.symbol} Price`,
  };

  const patternTraces = {};

  patterns.forEach((pattern) => {
    if (!patternTraces[pattern.type]) {
      patternTraces[pattern.type] = {
        x: [],
        y: [],
        text: [],
        mode: 'markers+text',
        textposition: 'top center',
        name: pattern.type,
        visible: pattern.type === activePattern ? true : 'legendonly',
      };
    }

    patternTraces[pattern.type].x.push(new Date(historicalData[pattern.index].openTime));
    patternTraces[pattern.type].y.push(historicalData[pattern.index].close);
    patternTraces[pattern.type].text.push(pattern.type);
  });

  const data = [trace1, ...Object.values(patternTraces)];

  const layout = {
    title: `${userInput.symbol} Price History`,
    xaxis: { title: 'Time' },
    yaxis: { title: 'Price' },
  };

  plotly.newPlot(document.getElementById('plot'), data, layout);
}



export { plotHistoricalData };
