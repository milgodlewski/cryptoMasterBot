import { JSDOM } from "jsdom";
import Chart, { drawChart } from "../src/components/Chart/Chart.mjs";

describe("Chart", () => {
  let dom;
  let chart;

  beforeEach(() => {
    dom = new JSDOM();
    global.document = dom.window.document;
    const canvas = document.createElement("canvas");
    chart = new Chart(canvas);
  });

  test("constructor creates a Chart object with expected properties", () => {
    expect(chart).toHaveProperty("canvas");
    expect(chart).toHaveProperty("ctx");
    expect(chart).toHaveProperty("chartInstance");
  });

  test("setData() sets the data for the chart", () => {
    const data = [{ time: "2021-01-01", price: 100 }];
    chart.setData(data);
    expect(chart.data).toBe(data);
  });

  test("draw() creates a new chart instance and destroys the previous one if it exists", () => {
    const destroySpy = jest.fn();
    chart.chartInstance = { destroy: destroySpy };
    chart.draw();
    expect(destroySpy).toHaveBeenCalled();
    expect(chart.chartInstance).not.toBeNull();
  });

  test("update() updates the chart data and re-renders the chart", () => {
    const newData = [{ time: "2021-01-02", price: 200 }];
    chart.update(newData);
    expect(chart.data).toBe(newData);
    expect(chart.chartInstance).not.toBeNull();
  });
});
