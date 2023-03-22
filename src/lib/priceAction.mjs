/**
* findSupportResistanceLevels - Analyzes price data to find support and resistance levels.
*
* @param {Array} priceData Array of price data, where each element contains { high, low, open, close }.
* @param {number} windowSize Size of the window used to find support and resistance levels.
* @param {number} reactionThreshold Threshold used to determine reactions.
* @returns {Array} Array of support and resistance levels, where each level has { price, type, reactions }.
*
* This function takes an array of price data and analyzes it to find potential support and resistance levels.
* It uses a sliding window approach to identify potential levels, comparing each price bar with its neighboring
* bars in the left and right windows. The function checks if the current bar's low or high price is a support
* or resistance level candidate, respectively. It then counts the reactions at each potential level and creates
* a level object with the required information.
*/
function findSupportResistanceLevels(priceData, windowSize = 5, reactionThreshold = 2) {
  const levels = [];
  
  for (let i = windowSize; i < priceData.length - windowSize; i++) {
    const leftWindow = priceData.slice(i - windowSize, i);
    const rightWindow = priceData.slice(i + 1, i + windowSize + 1);
    
    const supportCandidate = priceData[i].low;
    const resistanceCandidate = priceData[i].high;
    
    if (isPotentialSupport(leftWindow, rightWindow, supportCandidate)) {
      const reactions = countReactions(priceData, supportCandidate, reactionThreshold);
      levels.push(createLevel("support", supportCandidate, i, reactions));
    } else if (isPotentialResistance(leftWindow, rightWindow, resistanceCandidate)) {
      const reactions = countReactions(priceData, resistanceCandidate, reactionThreshold, false);
      levels.push(createLevel("resistance", resistanceCandidate, i, reactions));
    }
  }
  
  return levels;
}

/**
* isPotentialSupport - Checks if a price level is a potential support level.
*
* @param {Array} leftWindow Array of price data on the left side of the current bar.
* @param {Array} rightWindow Array of price data on the right side of the current bar.
* @param {number} price The price level to check for potential support.
* @returns {boolean} True if the price level is a potential support level, false otherwise.
*
* This function takes two arrays of price data (left and right windows) and a price level, and checks if
* the given price level is a potential support level. It does so by ensuring that all the lows in the left
* and right windows are higher than the given price level. If all lows are higher, it means the price level
* acts as support, and the function returns true, otherwise false.
*/
function isPotentialSupport(leftWindow, rightWindow, price) {
  return leftWindow.every((bar) => bar.low > price) &&
  rightWindow.every((bar) => bar.low > price);
}

/**
* isPotentialResistance - Checks if a price level is a potential resistance level.
* 
* @param {Array} leftWindow Array of price data on the left side of the current bar.
* @param {Array} rightWindow Array of price data on the right side of the current bar.
* @param {number} price The price level to check for potential resistance.
* @returns {boolean} True if the price level is a potential resistance level, false otherwise.
*
* This function takes two arrays of price data (left and right windows) and a price level, and checks if
* the given price level is a potential resistance level. It does so by ensuring that all the highs in the left
* and right windows are lower than the given price level. If all highs are lower, it means the price level
* acts as resistance, and the function returns true, otherwise false.
*/
function isPotentialResistance(leftWindow, rightWindow, price) {
  return leftWindow.every((bar) => bar.high < price) &&
  rightWindow.every((bar) => bar.high < price);
}

/**
* countReactions - Counts the number of reactions at a given price level.
*
* @param {Array} priceData Array of price data, where each element contains { high, low, open, close }.
* @param {number} price The price level to count reactions for.
* @param {number} reactionThreshold Threshold used to determine reactions.
* @param {boolean} isSupport If true, counts reactions for a support level, otherwise for a resistance level.
* @returns {number} The number of reactions at the given price level.
*
* This function takes an array of price data, a price level, a reaction threshold, and a boolean indicating
* whether the level is a support or resistance level. It then filters the price data based on the price
* difference between the current bar's low or high (depending on the level type) and the given price level,
* and returns the count of reactions within the specified threshold.
*/
function countReactions(priceData, price, reactionThreshold, isSupport = true) {
  return priceData.filter((bar) => {
    const priceDifference = isSupport ? bar.low - price : bar.high - price;
    return Math.abs(priceDifference) < reactionThreshold;
  }).length;
}

/**
* createLevel - Creates a level object with the specified properties.
*
* @param {string} type The type of level, either "support" or "resistance".
* @param {number} price The price level.
* @param {number} index The index of the level in the price data array.
* @param {number} reactions The number of reactions at the level.
* @returns {Object} A level object with the specified properties.
*
* This function takes a type, price level, index, and number of reactions, and returns a level object
* containing this information.
*/
function createLevel(type, price, index, reactions) {
  return {
    type,
    price,
    index,
    reactions,
  };
}

/**
* analyzePriceReactions - Analyzes price reactions at support and resistance levels.
*
* @param {Array} priceData Array of price data, where each element contains { high, low, open, close }.
* @param {Array} levels Array of support and resistance levels, where each level has { price, type, reactions }.
* @returns {Array} Array of price reactions, where each reaction has { level, totalReactions, positiveReactions, negativeReactions, successRate }.
*
* This function takes an array of price data and an array of support and resistance levels, and analyzes
* the price reactions at each level. For each level, it calculates the total reactions, positive reactions,
* negative reactions, and the success rate of the level. The result is an array of price reactions containing
* this information.
*/
function analyzePriceReactions(priceData, levels) {
  return levels.map((level) => {
    const priceReactionData = priceData.filter((bar) => {
      const priceDifference = level.type === "support" ? bar.low - level.price : bar.high - level.price;
      return Math.abs(priceDifference) < level.reactions;
    });
    
    const totalReactions = priceReactionData.length;
    const positiveReactions = countPositiveReactions(priceReactionData, level.type);
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
}

/**
* countPositiveReactions - Counts the number of positive reactions at a given level.
*
* @param {Array} priceReactionData Array of price data filtered for reactions at a specific level.
* @param {string} levelType The type of level, either "support" or "resistance".
* @returns {number} The number of positive reactions at the given level.
*
* This function takes an array of price data filtered for reactions at a specific level and the level type
* (support or resistance). It counts the number of positive reactions, which are defined as bars where the
* close is greater than the open for support levels or less than the open for resistance levels, and the low
* or high matches the level price. The result is the count of positive reactions at the given level.
*/
function countPositiveReactions(priceReactionData, levelType) {
  return priceReactionData.filter((bar) => {
    if (levelType === "support") {
      return bar.close > bar.open && bar.low === levelType.price;
    } else {
      return bar.close < bar.open && bar.high === levelType.price;
    }
  }).length;
}

/**
* detectFirstTests - Detects the first tests of support and resistance levels.
*
* @param {Array} priceData Array of price data, where each element contains { high, low, open, close }.
* @param {Array} priceReactions Array of price reactions, where each reaction has { level, totalReactions, positiveReactions, negativeReactions, successRate }.
* @returns {Array} Array of first tests of support and resistance levels, where each test has { level, firstTest, isPositive }.
*
* This function takes an array of price data and an array of price reactions, and detects the first tests of
* support and resistance levels. For each reaction, it finds the first bar that touches the level after a
* previous bar that didn't touch it. If a first test is detected, it checks if the test is positive (a
  * successful bounce for support levels or a successful rejection for resistance levels) and creates an object
  * with the level, first test data, and the positivity status. The result is an array of first tests of support
  * and resistance levels.
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