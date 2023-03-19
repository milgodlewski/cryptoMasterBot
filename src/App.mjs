import { drawChart } from './components/Chart/Chart.mjs';
import { initializeTradeHistory } from './components/TradeHistory/TradeHistory.mjs';
import { initializeTradeForm } from './components/TradeForm/TradeForm.mjs';

function main() {
  drawChart();
  initializeTradeHistory();
  initializeTradeForm();
}

export { main };
