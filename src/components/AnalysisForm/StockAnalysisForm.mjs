class StockAnalysisForm {
  constructor(onSubmit) {
    this.form = document.getElementById('analysis-form');
    this.onSubmit = onSubmit;
    this.initEventListeners();
  }

  initEventListeners() {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();

      const symbol = document.getElementById('symbol').value;
      const startDate = document.getElementById('start-date').value;
      const endDate = document.getElementById('end-date').value;
      const interval = document.getElementById('interval').value;

      this.onSubmit({ symbol, startDate, endDate, interval });
    });
  }

  onSubmit(userInput) {
    // This method will be overridden by the instance of the class.
  }
}

export default StockAnalysisForm;