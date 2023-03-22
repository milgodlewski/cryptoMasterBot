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
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  
    // Sprawdź, czy this.data zostało zainicjowane przed próbą jego wykorzystania
    if (!this.data) {
      return;
    }
  
    this.chartInstance = new ChartJS(this.ctx, {
      type: "line",
      data: {
        labels: this.data.map((item) => item.time),
        datasets: [
          {
            label: "Cena",
            data: this.data.map((item) => item.price),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "time",
          },
        },
      },
    });
  }
  

  update(newData) {
    this.setData(newData);
    this.draw();
  }
}

export default Chart;

export function drawChart() {
  const chartContainer = document.getElementById("chart-container");
  const canvas = document.createElement("canvas");
  chartContainer.appendChild(canvas);

  const chart = new Chart(canvas);

  // Tylko jeśli sampleData istnieje, ustaw dane na wykresie
  if (typeof sampleData !== 'undefined') {
    chart.setData(sampleData);
  }

  chart.draw();
}

