class PriceData {
  constructor() {
    this.data = {};
  }

  add(symbol, historicalData) {
    if (!Array.isArray(historicalData)) {
      throw new Error("Invalid historical data format");
    }

    this.data[symbol] = historicalData;
  }

  get(symbol) {
    return this.data[symbol] || [];
  }
}

const priceData = new PriceData();
export default priceData;
