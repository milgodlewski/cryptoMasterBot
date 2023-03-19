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

    // Validate and process the form data
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

document.getElementById("user-input-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const symbol = document.getElementById("symbol").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const interval = document.getElementById("interval").value;

  // Wywołaj funkcję z nowej aplikacji, która będzie obsługiwać przekazane wartości
  handleFormSubmit(symbol, startDate, endDate, interval);
});
