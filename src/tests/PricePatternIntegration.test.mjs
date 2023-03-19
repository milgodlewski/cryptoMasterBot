import { PricePatternAnalyzer } from "../PricePatternAnalyzer.mjs";
import { PatternGrouper } from "../PatternGrouper.mjs";

describe("PricePatternAnalyzer and PatternGrouper integration", () => {
  test("analyzePatterns and groupPatternsByType work correctly together", () => {
    const prices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const volumes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const patterns = PricePatternAnalyzer.analyzePatterns(prices, volumes);
    const groupedPatterns = PatternGrouper.groupPatternsByType(patterns);

    // Przykład sprawdzenia, czy analiza wzorców i grupowanie przebiegają poprawnie
    expect(groupedPatterns).toHaveProperty("WzorzecA");
    expect(groupedPatterns).toHaveProperty("WzorzecB");
    expect(groupedPatterns.WzorzecA.length).toBeGreaterThan(0);
    expect(groupedPatterns.WzorzecB.length).toBeGreaterThan(0);
  });
});

