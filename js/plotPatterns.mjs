import * as plotly from 'plotly.js-dist';

function plotHistoricalData(prices, patterns, userInput) {
  const trace1 = {
    x: prices.map((entry) => new Date(entry.openTime)),
    y: prices.map((entry) => entry.close),
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
      };
    }

    patternTraces[pattern.type].x.push(new Date(prices[pattern.index].openTime));
    patternTraces[pattern.type].y.push(prices[pattern.index].close);
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
