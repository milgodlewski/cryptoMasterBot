import './tailwind.css';
import { drawChart } from './components/Chart/Chart.mjs';
import { initializeTradeHistory } from './components/TradeHistory/TradeHistory.mjs';
import { initializeTradeForm } from './components/TradeForm/TradeForm.mjs';
import { analyzePatterns } from './lib/PatternAnalyzer.mjs';
import { patternPerformance } from './lib/PatternPerformance.mjs';
import Plotter from './components/Chart/Plotter.mjs';
import HistoricalFetcher from './data/HistoricalFetcher.mjs';
import StockAnalysisForm from './components/AnalysisForm/StockAnalysisForm.mjs';
import CandlestickAnalyzer from './lib/CandlestickAnalyzer.mjs';

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
    console.log('historicalData:', historicalData);
    const prices = historicalData.map((entry) => entry.close);
    const volumes = historicalData.map((entry) => entry.volume);
    const patterns = analyzePatterns(prices, volumes);
    const performanceResults = patternPerformance(prices, patterns);
    const activePattern = selectBestPattern(performanceResults);
    
    const analyzer = new CandlestickAnalyzer(historicalData);
    const supportResistanceLevels = analyzer.findSupportResistanceLevels(historicalData);
    // const candlestickPatterns = analyzer.detectCandlestickPatterns(historicalData);
    
    console.log('Support and Resistance Levels:', supportResistanceLevels);
    displaySupportResistanceLevels(supportResistanceLevels);
    
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

function displaySupportResistanceLevels(supportResistanceLevels) {
  const container = document.getElementById('support-resistance');
  container.innerHTML = '';
  
  if (supportResistanceLevels && supportResistanceLevels.length > 0) {
    supportResistanceLevels.forEach((level, index) => {
      const levelElement = document.createElement('div');
      levelElement.classList.add('flex', 'justify-between', 'mb-2');
      
      const levelLabel = document.createElement('span');
      levelLabel.textContent = `Poziom ${index + 1}: `;
      levelLabel.classList.add('font-bold');
      levelElement.appendChild(levelLabel);
      if( level.type === "support" ) {
        const supportElement = document.createElement('span');
        supportElement.textContent = `Wsparcie: ${level.price.toFixed(2)}`;
        supportElement.classList.add('text-green-600');
        levelElement.appendChild(supportElement);
      } else if( level.type === "resistance" ) {
        
        const resistanceElement = document.createElement('span');
        resistanceElement.textContent = `Opor: ${level.price.toFixed(2)}`;
        resistanceElement.classList.add('text-red-600');
        levelElement.appendChild(resistanceElement);
      }
      container.appendChild(levelElement);
    });
  } else {
    container.textContent = 'Brak stref wsparcia i oporu dla aktualnych danych.';
  }
}



export { main, handleFormSubmit };