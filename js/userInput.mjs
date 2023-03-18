class UserInput {
  static async getUserInput() {
    return new Promise((resolve) => {
      const form = document.getElementById("user-input-form");
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const symbol = event.target.elements.symbol.value;
        const startDate = event.target.elements["start-date"].value;
        const endDate = event.target.elements["end-date"].value;
        const interval = event.target.elements.interval.value;

        resolve({ symbol, startDate, endDate, interval });
      });
    });
  }
}

export default UserInput;
