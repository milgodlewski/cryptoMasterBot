class PatternGrouper {
  static groupPatternsByType(patterns) {
    const groupedPatterns = {};

    patterns.forEach(pattern => {
      if (!groupedPatterns[pattern.type]) {
        groupedPatterns[pattern.type] = [];
      }
      groupedPatterns[pattern.type].push(pattern.index);
    });

    return groupedPatterns;
  }
}

export default PatternGrouper;
