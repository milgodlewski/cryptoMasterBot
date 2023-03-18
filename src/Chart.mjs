import { Chart as ChartJS } from "chart.js";

class Chart {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
    this.chartInstance = null;
  }

  setData(data) {
    this.data = data;
  }

  draw() {
    // Usuń istniejący wykres, jeśli istnieje
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Utwórz nowy wykres z danymi z `this.data`
    this.chartInstance = new ChartJS(this.ctx, {
      type: "line", // Wybierz typ wykresu, np. liniowy
      data: {
        labels: this.data.map((item) => item.time), // Konwertuj dane na etykiety osi X
        datasets: [
          {
            label: "Cena",
            data: this.data.map((item) => item.price), // Konwertuj dane na wartości osi Y
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "time", // Ustaw skalę osi X na czas
          },
        },
      },
    });
  }

  update(newData) {
    // Aktualizuj dane wykresu i narysuj go ponownie
    this.setData(newData);
    this.draw();
  }
}

export default Chart;
