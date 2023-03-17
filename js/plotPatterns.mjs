import * as plotly from 'plotly.js-dist';

function plotHistoricalData(prices, patterns, userInput) {
  const trace1 = {
    x: prices.map((entry) => new Date(entry.openTime)),
    y: prices.map((entry) => entry.close),
    mode: 'lines',
    name: `${userInput.symbol} Price`,
  };

  const trace2 = {
    x: patterns.map((pattern) => new Date(prices[pattern.index].openTime)),
    y: patterns.map((pattern) => prices[pattern.index].close),
    text: patterns.map((pattern) => pattern.type),
    mode: 'markers+text',
    textposition: 'top center',
    name: 'Patterns',
  };

  const data = [trace1, trace2];

  const layout = {
    title: `${userInput.symbol} Price History`,
    xaxis: { title: 'Time' },
    yaxis: { title: 'Price' },
  };

  plotly.newPlot(document.getElementById('plot'), data, layout);
}

export { plotHistoricalData };
