/**
 * Checks if the given candlestick pattern is an Abandoned Baby pattern.
 * @function isAbandonedBaby
 * @param {Array} data - The array of OHLC bars.
 * @param {number} index - The index of the current bar in the data array.
 * @returns {boolean} Returns true if the pattern is an Abandoned Baby, otherwise false.
 */
function isAbandonedBaby(data, index) {
  if (index < 2 || index >= data.length) {
    return false;
  }
  
  const prevBar = data[index - 1];
  const currBar = data[index];
  const nextBar = data[index + 1];
  const isPrevDoji = isDoji(prevBar);
  const isCurrDoji = isDoji(currBar);
  const isNextDoji = isDoji(nextBar);
  
  return !isPrevDoji && isCurrDoji && !isNextDoji && Math.abs(currBar.open - prevBar.close) > 0.01 * prevBar.close && Math.abs(currBar.open - nextBar.close) > 0.01 * nextBar.close;
}

/**
 * Checks if the given candlestick pattern is a Bearish Engulfing pattern.
 * @function isBearishEngulfing
 * @param {Object} prevBar - The previous OHLC bar.
 * @param {Object} currBar - The current OHLC bar.
 * @returns {boolean} Returns true if the pattern is a Bearish Engulfing, otherwise false.
 */
function isBearishEngulfing(prevBar, currBar) {
  return prevBar.open < prevBar.close && currBar.open > currBar.close && currBar.open >= prevBar.close && currBar.close <= prevBar.open;
}

/**
 * Checks if the given candlestick pattern is a Bullish Engulfing pattern.
 * @function isBullishEngulfing
 * @param {Object} prevBar - The previous OHLC bar.
 * @param {Object} currBar - The current OHLC bar.
 * @returns {boolean} Returns true if the pattern is a Bullish Engulfing, otherwise false.
 */
function isBullishEngulfing(prevBar, currBar) {
  return prevBar.open > prevBar.close && currBar.open < currBar.close && currBar.close >= prevBar.open && currBar.open <= prevBar.close;
}

/**
 * Checks if the given candlestick pattern is a Bullish or Bearish Harami pattern.
 * @function isBullishOrBearishHarami
 * @param {Object} prevBar - The previous OHLC bar.
 * @param {Object} currBar - The current OHLC bar.
 * @returns {string|null} Returns 'bullish_harami' if the pattern is a Bullish Harami, 'bearish_harami' if the pattern is a Bearish Harami, or null if neither.
 */
function isBullishOrBearishHarami(prevBar, currBar) {
  const isBullishHarami = prevBar.open > prevBar.close && currBar.open < currBar.close && currBar.open > prevBar.close && currBar.close < prevBar.open;
  const isBearishHarami = prevBar.open < prevBar.close && currBar.open > currBar.close && currBar.open < prevBar.close && currBar.close > prevBar.open;
  
  if (isBullishHarami) {
    return 'bullish_harami';
  } else if (isBearishHarami) {
    return 'bearish_harami';
  } else {
    return null;
  }
}

/**
 * Checks if the given candlestick pattern is a Dark Cloud Cover pattern.
 * @function isDarkCloudCover
 * @param {Object} prevBar - The previous OHLC bar.
 * @param {Object} currBar - The current OHLC bar.
 * @returns {boolean} Returns true if the pattern is a Dark Cloud Cover, otherwise false.
 */
function isDarkCloudCover(prevBar, currBar) {
  return prevBar.open < prevBar.close && currBar.open > currBar.close && currBar.open > prevBar.high && currBar.close < (prevBar.open + prevBar.close) / 2;
}

/**
 * Checks if the given candlestick pattern is a Doji pattern.
 * @function isDoji
 * @param {Object} bar - The OHLC bar.
 * @returns {boolean} Returns true if the pattern is a Doji, otherwise false.
 */
function isDoji(bar) {
  const bodySize = Math.abs(bar.close - bar.open);
  return bodySize <= 0.01 * (bar.high - bar.low);
}

/**
 * Checks if the given candlestick pattern is an Evening Star pattern.
 * @function isEveningStar
 * @param {Array} data - The array of OHLC bars.
 * @param {number} index - The index of the current bar in the data array.
 * @returns {boolean} Returns true if the pattern is an Evening Star, otherwise false.
 */
function isEveningStar(data, index) {
  if (index < 2) {
    return false;
  }
  
  const prev2Bar = data[index - 2];
  const prevBar = data[index - 1];
  const currBar = data[index];
  const isPrev2BarBullish = prev2Bar.open < prev2Bar.close;
  const isPrevBarDoji = isDoji(prevBar);
  const isCurrBarBearish = currBar.open > currBar.close;
  
  return isPrev2BarBullish && isPrevBarDoji && isCurrBarBearish && prevBar.close > prev2Bar.close && currBar.close < prev2Bar.close;
}

/**
 * Checks if the given candlestick pattern is a Falling Three Methods pattern.
 * @function isFallingThreeMethods
 * @param {Array} data - The array of OHLC bars.
 * @param {number} index - The index of the current bar in the data array.
 * @returns {boolean} Returns true if the pattern is a Falling Three Methods, otherwise false.
 */
function isFallingThreeMethods(data, index) {
  if (index < 4) {
    return false;
  }
  
  const firstBar = data[index - 4];
  const secondBar = data[index - 3];
  const thirdBar = data[index - 2];
  const fourthBar = data[index - 1];
  const fifthBar = data[index];
  
  return firstBar.open > firstBar.close && secondBar.open > secondBar.close && thirdBar
  open < thirdBar.close && fourthBar.open < fourthBar.close && fifthBar.open > fifthBar.close && firstBar.open > secondBar.open && firstBar.close > secondBar.close && fifthBar.open < thirdBar.close && fifthBar.close < firstBar.close && thirdBar.high < firstBar.close && fourthBar.high < firstBar.close;
}

/**
 * Checks if the given candlestick pattern is a Hammer or Hanging Man pattern.
 * @function isHammerOrHangingMan
 * @param {Object} prevBar - The previous OHLC bar.
 * @param {Object} currBar - The current OHLC bar.
 * @returns {boolean} Returns true if the pattern is a Hammer or Hanging Man, otherwise false.
 */
function isHammerOrHangingMan(prevBar, currBar) {
  const bodySize = Math.abs(currBar.close - currBar.open);
  const lowerShadow = currBar.open - currBar.low;
  const upperShadow = currBar.high - currBar.close;
  const minShadowSize = 2 * bodySize;
  
  return lowerShadow >= minShadowSize && upperShadow <= bodySize / 2;
}
function isInvertedHammer(prevBar, currBar) {
  const bodySize = Math.abs(currBar.close - currBar.open);
  const lowerShadow = currBar.open - currBar.low;
  const upperShadow = currBar.high - currBar.close;
  const minShadowSize = 2 * bodySize;
  
  return upperShadow >= minShadowSize && lowerShadow <= bodySize / 2;
}

function isKicker(data, index) {
  if (index < 1) {
    return false;
  }
  
  const prevBar = data[index - 1];
  const currBar = data[index];
  const isPrevBarBullish = prevBar.open < prevBar.close;
  const isCurrBarBullish = currBar.open < currBar.close;
  const isPrevBarBearish = prevBar.open > prevBar.close;
  const isCurrBarBearish = currBar.open > currBar.close;
  
  return (isPrevBarBullish && isCurrBarBearish && currBar.open <= prevBar.open && currBar.close <= prevBar.open) || (isPrevBarBearish && isCurrBarBullish && currBar.open >= prevBar.open && currBar.close >= prevBar.open);
}

function isMarubozu(bar) {
  const bodySize = Math.abs(bar.close - bar.open);
  const lowerShadow = bar.open - bar.low;
  const upperShadow = bar.high - bar.close;
  
  return lowerShadow <= 0.01 * bodySize && upperShadow <= 0.01 * bodySize;
}

function isMorningStar(data, index) {
  if (index < 2) {
    return false;
  }
  
  const prev2Bar = data[index - 2];
  const prevBar = data[index - 1];
  const currBar = data[index];
  const isPrev2BarBearish = prev2Bar.open > prev2Bar.close;
  const isPrevBarDoji = isDoji(prevBar);
  const isCurrBarBullish = currBar.open < currBar.close;
  
  return isPrev2BarBearish && isPrevBarDoji && isCurrBarBullish && prevBar.close < prev2Bar.close && currBar.close > prev2Bar.close;
}

function isPiercingLine(prevBar, currBar) {
  return prevBar.open < prevBar.close && currBar.open > currBar.close && currBar.open < prevBar.low && currBar.close > (prevBar.open + prevBar.close) / 2;
}


function isRisingThreeMethods(data, index) {
  if (index < 4) return false;

  const [first, second, third, fourth, fifth] = [
    data[index - 4],
    data[index - 3],
    data[index - 2],
    data[index - 1],
    data[index]
  ];

  return (
    first.close < first.open &&
    second.close > second.open &&
    third.close > third.open &&
    fourth.close > fourth.open &&
    fifth.close < fifth.open &&
    first.open > fifth.close &&
    second.close < first.close &&
    second.open > fifth.open
  );
}

function isShootingStar(prevBar, currBar) {
  const isPrevBullish = prevBar.close > prevBar.open;
  const isCurrBearish = currBar.close < currBar.open;
  const upperShadow = currBar.high - Math.max(currBar.open, currBar.close);
  const lowerShadow = Math.min(currBar.open, currBar.close) - currBar.low;
  const bodySize = Math.abs(currBar.open - currBar.close);

  return (
    isPrevBullish && 
    isCurrBearish &&
    upperShadow >= 2 * bodySize &&
    lowerShadow <= bodySize * 0.25
  );
}

function isThreeBlackCrows(data, index) {
  if (index < 2) return false;

  const [first, second, third] = [
    data[index - 2],
    data[index - 1],
    data[index]
  ];

  return (
    first.close < first.open &&
    second.close < second.open &&
    third.close < third.open &&
    first.close > second.open &&
    second.close > third.open
  );
}

function isThreeInsideDown(data, index) {
  if (index < 1) return false;

  const [first, second] = [data[index - 1], data[index]];

  return (
    first.close > first.open &&
    second.close < second.open &&
    second.close < first.open &&
    second.open > first.close
  );
}

function isThreeInsideUp(data, index) {
  if (index < 1) return false;

  const [first, second] = [data[index - 1], data[index]];

  return (
    first.close < first.open &&
    second.close > second.open &&
    second.close > first.open &&
    second.open < first.close
  );
}

function isThreeOutsideDown(data, index) {
  if (index < 1) return false;

  const [first, second] = [data[index - 1], data[index]];

  return (
    first.close > first.open &&
    second.close < second.open &&
    second.close < first.close &&
    second.open > first.open
  );
}

function isThreeOutsideUp(data, index) {
  if (index < 1) return false;

  const [first, second] = [data[index - 1], data[index]];

  return (
    first.close < first.open &&
    second.close > second.open &&
    second.close > first.close &&
    second.open < first.open
  );
}

function isThreeWhiteSoldiers(data, index) {
  if (index < 2) return false;

  const [first, second, third] = [
    data[index - 2],
    data[index - 1],
    data[index]
  ];

  return (
    first.close > first.open &&
    second.close > second.open &&
    third.close > third.open &&
    first.close < second.open &&
    second.close < third.open
  );
}

function isTweezerBottoms(data, index) {
  if (index < 1) return false;

  const [first, second] = [data[index - 1], data[index]];

  return (
    first.close < first.open &&
    second.close > second.open &&
    first.low === second.low
  );
}

function isTweezerTops(data, index) {
  if (index < 1) return false;

  const [first, second] = [data[index - 1], data[index]];

  return (
    first.close > first.open &&
    second.close < second.open &&
    first.high === second.high
  );
}

function isTwoCrows(data, index) {
  if (index < 2) return false;

  const [first, second, third] = [
    data[index - 2],
    data[index - 1],
    data[index]
  ];

  return (
    first.close > first.open &&
    second.close > second.open &&
    third.close < third.open &&
    first.close < second.open &&
    second.close < third.open &&
    third.close > first.close
  );
}
