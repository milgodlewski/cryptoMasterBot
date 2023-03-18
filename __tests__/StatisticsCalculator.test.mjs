import { StatisticsCalculator } from "../StatisticsCalculator.mjs";

describe("StatisticsCalculator", () => {
  test("calculateMean returns the correct mean value", () => {
    const array = [1, 2, 3, 4, 5];
    const result = StatisticsCalculator.calculateMean(array);
    expect(result).toBe(3);
  });
});