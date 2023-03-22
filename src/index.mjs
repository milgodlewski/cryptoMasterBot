import { main } from './App.mjs';

function setDefaultValues() {
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const symbolInput = document.getElementById('symbol');

  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  startDateInput.valueAsDate = oneYearAgo;
  endDateInput.valueAsDate = today;
  symbolInput.value = 'BTCUSDT';
}

document.addEventListener('DOMContentLoaded', () => {
  setDefaultValues();
  main();
});
