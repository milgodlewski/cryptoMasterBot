import './tailwind.css';
import { drawChart } from './components/Chart/Chart.mjs';
import { initializeTradeHistory } from './components/TradeHistory/TradeHistory.mjs';
import { initializeTradeForm } from './components/TradeForm/TradeForm.mjs';
import { analyzePatterns } from './lib/PatternAnalyzer.mjs';
import { patternPerformance } from './lib/PatternPerformance.mjs';
import Plotter from './components/Chart/Plotter.mjs';
import HistoricalFetcher from './data/HistoricalFetcher.mjs';
import StockAnalysisForm from './components/AnalysisForm/StockAnalysisForm.mjs';

async function main() {
  drawChart();
  initializeTradeHistory();
  initializeTradeForm();
  
  const plotter = new Plotter(); 
  const analysisForm = new StockAnalysisForm();
  analysisForm.onSubmit = async (userInput) => {
    console.log(userInput);
    await handleFormSubmit(userInput.symbol, userInput.startDate, userInput.endDate, userInput.interval, plotter);
  };
}

window.addEventListener('DOMContentLoaded', main);

async function handleFormSubmit(symbol, startDate, endDate, interval, plotter) {
  try {
    const historicalData = await HistoricalFetcher.getHistoricalData(symbol, startDate, endDate, interval);
    
    const prices = historicalData.map((entry) => entry.close);
    const volumes = historicalData.map((entry) => entry.volume);
    const patterns = analyzePatterns(prices, volumes);
    const performanceResults = patternPerformance(prices, patterns);
    const activePattern = selectBestPattern(performanceResults);
    
    const options = {
      activePattern
    };
    
    plotter.plotHistoricalData({
      historicalData,
      patterns,
      userInput: { symbol },
      options,
      performanceResults,
    });
    
  } catch (error) {
    console.error('Error in handleFormSubmit:', error);
  }
}

function selectBestPattern(performanceResults) {
  let bestPattern = null;
  let bestPositiveRate = -Infinity;
  
  Object.keys(performanceResults).forEach((patternType) => {
    const positiveRate = performanceResults[patternType].positiveRate;
    if (positiveRate > bestPositiveRate) {
      bestPositiveRate = positiveRate;
      bestPattern = patternType;
    }
  });
  
  return bestPattern;
}

export { main, handleFormSubmit };