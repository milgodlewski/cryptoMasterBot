class TradeData {
  constructor() {
    this.trades = [];
  }

  add(trade) {
    if (!trade || typeof trade !== "object") {
      throw new Error("Invalid trade data format");
    }

    this.trades.push(trade);
  }

  getAll() {
    return this.trades;
  }
}

const tradeData = new TradeData();
export default tradeData;
