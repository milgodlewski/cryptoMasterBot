class TradeHistory {
  constructor() {
    this.trades = [];
  }

  addTrade(trade) {
    this.trades.push(trade);
  }

  getTrades() {
    return this.trades;
  }

  removeTrade(tradeIndex) {
    this.trades.splice(tradeIndex, 1);
  }

  updateTrade(tradeIndex, updatedTrade) {
    this.trades[tradeIndex] = updatedTrade;
  }

  clearTrades() {
    this.trades = [];
  }
}

export default TradeHistory;

export function initializeTradeHistory() {
}
