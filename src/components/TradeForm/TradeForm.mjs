class TradeForm {
  constructor() {
    this.form = document.getElementById("trade-form");
    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();

    const symbol = this.form["symbol"].value;
    const orderType = this.form["order-type"].value;
    const quantity = parseFloat(this.form["quantity"].value);

    if (symbol && orderType && quantity) {
      console.log(`New trade: ${orderType.toUpperCase()} ${quantity} ${symbol}`);
      this.form.reset();
    } else {
      alert("Please fill in all fields correctly.");
    }
  }
}

export function initializeTradeForm() {
  const tradeForm = new TradeForm();
}
