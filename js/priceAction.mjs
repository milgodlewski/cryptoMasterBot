/**
 * findSupportResistanceLevels - Analizuje dane cenowe w celu znalezienia poziomów wsparcia i oporu.
 *
 * @param {Array} priceData Tablica danych cenowych, w której każdy element zawiera { high, low, open, close }.
 * @returns {Array} Tablica poziomów wsparcia i oporu, gdzie każdy poziom ma { price, type, reactions }.
 */
function findSupportResistanceLevels(priceData, windowSize = 5, reactionThreshold = 2) {
  const levels = [];

  for (let i = windowSize; i < priceData.length - windowSize; i++) {
    const leftWindow = priceData.slice(i - windowSize, i);
    const rightWindow = priceData.slice(i + 1, i + windowSize + 1);
    const currentPrice = priceData[i].low; // Dla wsparcia bierzemy najniższą cenę świecy

    const isSupport = leftWindow.every((bar) => bar.low > currentPrice) &&
                      rightWindow.every((bar) => bar.low > currentPrice);

    if (isSupport) {
      const reactions = priceData.filter((bar) => Math.abs(bar.low - currentPrice) < reactionThreshold).length;

      levels.push({
        type: "support",
        price: currentPrice,
        index: i,
        reactions,
      });
    } else {
      const currentPrice = priceData[i].high; // Dla oporu bierzemy najwyższą cenę świecy

      const isResistance = leftWindow.every((bar) => bar.high < currentPrice) &&
                           rightWindow.every((bar) => bar.high < currentPrice);

      if (isResistance) {
        const reactions = priceData.filter((bar) => Math.abs(bar.high - currentPrice) < reactionThreshold).length;

        levels.push({
          type: "resistance",
          price: currentPrice,
          index: i,
          reactions,
        });
      }
    }
  }

  return levels;
}

/**
 * analyzePriceReactions - Analizuje reakcje cenowe na poziomach wsparcia i oporu.
 *
 * @param {Array} priceData Tablica danych cenowych, w której każdy element zawiera { high, low, open, close }.
 * @param {Array} levels Tablica poziomów wsparcia i oporu, gdzie każdy poziom ma { price, type, reactions }.
 * @returns {Array} Tablica reakcji cenowych, gdzie każda reakcja ma { level, priceReaction }.
 */
function analyzePriceReactions(priceData, levels) {
  const priceReactions = levels.map((level) => {
    const priceReactionData = priceData.filter((bar) => {
      const priceDifference = level.type === "support" ? bar.low - level.price : bar.high - level.price;
      return Math.abs(priceDifference) < level.reactions;
    });

    const totalReactions = priceReactionData.length;
    const positiveReactions = priceReactionData.filter((bar) => {
      if (level.type === "support") {
        return bar.close > bar.open && bar.low === level.price;
      } else {
        return bar.close < bar.open && bar.high === level.price;
      }
    }).length;

    const negativeReactions = totalReactions - positiveReactions;
    const successRate = positiveReactions / totalReactions;

    return {
      level,
      totalReactions,
      positiveReactions,
      negativeReactions,
      successRate,
    };
  });

  return priceReactions;
}

/**
 * detectFirstTests - Wykrywa pierwsze testy poziomów wsparcia i oporu.
 *
 * @param {Array} priceData Tablica danych cenowych, w której każdy element zawiera { high, low, open, close }.
 * @param {Array} priceReactions Tablica reakcji cenowych, gdzie każda reakcja ma { level, priceReaction }.
 * @returns {Array} Tablica pierwszych testów poziomów wsparcia i oporu, gdzie każdy test ma { level, firstTest, isPositive }.
 */
function detectFirstTests(priceData, priceReactions) {
  const firstTests = priceReactions.map((reaction) => {
    const firstReactionData = priceData.find((bar, index) => {
      if (index === 0) return false; // Skip the first bar

      const prevBar = priceData[index - 1];
      const priceDifference = reaction.level.type === "support" ? bar.low - reaction.level.price : bar.high - reaction.level.price;
      const prevPriceDifference = reaction.level.type === "support" ? prevBar.low - reaction.level.price : prevBar.high - reaction.level.price;

      // Check if the current bar is the first to touch the level
      return Math.abs(priceDifference) < reaction.level.reactions && Math.abs(prevPriceDifference) >= reaction.level.reactions;
    });

    if (firstReactionData) {
      const isPositiveReaction = reaction.level.type === "support"
        ? firstReactionData.close > firstReactionData.open && firstReactionData.low === reaction.level.price
        : firstReactionData.close < firstReactionData.open && firstReactionData.high === reaction.level.price;

      return {
        level: reaction.level,
        firstTest: firstReactionData,
        isPositive: isPositiveReaction,
      };
    } else {
      return null;
    }
  });

  return firstTests.filter((test) => test !== null);
}

export {
  findSupportResistanceLevels,
  analyzePriceReactions,
  detectFirstTests,
};


export {
  findSupportResistanceLevels,
  analyzePriceReactions,
  detectFirstTests,
};
