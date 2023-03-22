class AnalysisInputForm {
  static async getUserInput() {
    return new Promise((resolve) => {
      const form = document.getElementById("analysis-input-form");
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const symbol = event.target.elements.symbol.value;
        const startDate = event.target.elements.startDate.value;
        const endDate = event.target.elements.endDate.value;
        const interval = event.target.elements.interval.value;

        resolve({ symbol, startDate, endDate, interval });
      });
    });
  }
}

export default AnalysisInputForm;
