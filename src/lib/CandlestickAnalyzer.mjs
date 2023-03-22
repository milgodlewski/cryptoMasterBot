import {
    isHammerOrHangingMan,
    isBullishOrBearishHarami,
    isMarubozu,
    isThreeWhiteSoldiers,
    isEveningStar,
    isBullishEngulfing,
    isBearishEngulfing,
    isDarkCloudCover,
    isPiercingLine,
    isShootingStar,
    isInvertedHammer,
    isTweezerTops,
    isTweezerBottoms,
    isThreeInsideUp,
    isThreeInsideDown,
    isThreeOutsideUp,
    isThreeOutsideDown,
    isAbandonedBaby,
    isDoji,
    isKicker,
    isTwoCrows,
    isRisingThreeMethods,
    isFallingThreeMethods,
    isMorningStar,
    isThreeBlackCrows,
} from 'candlestickPatterns.mjs';

/**
* CandlestickAnalyzer - A class to analyze candlestick patterns and find support and resistance levels.
*/
class CandlestickAnalyzer {
    /**
    * constructor - Initializes the CandlestickAnalyzer class.
    * @param {Array} data Array of price data, where each element contains { high, low, open, close }.
    */
    constructor(data) {
        this.data = data;
    }
    
    /**
    * findSupportResistanceLevels - Analyzes price data to find support and resistance levels.
    *
    * @param {Array} data Array of price data, where each element contains { high, low, open, close }.
    * @returns {Array} Array of support and resistance levels, where each level has { price, type }.
    *
    * This function takes an array of price data and attempts to find support and resistance levels
    * using a generic approach. The algorithm calculates potential levels based on price pivots,
    * and the result is an array of support and resistance levels.
    */
    findSupportResistanceLevels(data) {
        const potentialLevels = findCandlestickPatterns(data);
        const supportAndResistanceLevels = findPotentialLevels(data);
        const supportResistanceLevels = groupAndFilterLevels(potentialLevels);
        return supportResistanceLevels;
    }
    
    /**
    * findPotentialLevels - Finds potential support and resistance levels in the given price data.
    *
    * @param {Array} data Array of price data, where each element contains { high, low, open, close }.
    * @returns {Array} Array of potential support and resistance levels, where each level has { price, type }.
    *
    * This function takes an array of price data and attempts to find potential support and resistance
    * levels by identifying price pivots. A pivot is a point where the price changes direction.
    * The function checks if the current high is higher than the previous and next high, and if so,
    * adds it as a resistance level. Similarly, it checks if the current low is lower than the previous
    * and next low, and if so, adds it as a support level. The result is an array of potential
    * support and resistance levels.
    */
    findPotentialLevels(data) {
        const pivots = [];
        
        for (let i = 1; i < data.length - 1; i++) {
            const [previous, current, next] = [data[i - 1], data[i], data[i + 1]];
            
            if (current.high > previous.high && current.high > next.high) {
                pivots.push({ price: current.high, type: 'resistance' });
            }
            
            if (current.low < previous.low && current.low < next.low) {
                pivots.push({ price: current.low, type: 'support' });
            }
        }
        
        return pivots;
    }
    
    
    /**
    
    groupAndFilterLevels - Groups and filters potential support and resistance levels based on a specified tolerance.

    @param {Array} potentialLevels Array of potential support and resistance levels, where each level has { price, type }.
    @returns {Array} Array of support and resistance levels after grouping and filtering, where each level has { price, type }.
    
    This function takes an array of potential support and resistance levels as input and groups similar levels
    based on a specified tolerance. The tolerance value is used to determine the maximum percentage difference
    between two levels that can be considered as a single level. After grouping the levels, the function filters
    out any extraneous data and returns an array of support and resistance levels.
    The input array 'potentialLevels' should contain objects with the following properties:
    price (number): The price level of the potential support or resistance.
    type (string): The type of level, either 'support' or 'resistance'.
    The output array will have the same structure as the input array, but with grouped and filtered levels.
    Example usage:
    const potentialLevels = [
        { price: 100, type: 'support' },
        { price: 101, type: 'support' },
        { price: 200, type: 'resistance' },
    ];
    const supportResistanceLevels = groupAndFilterLevels(potentialLevels);
    // supportResistanceLevels = [
    // { price: 100.5, type: 'support' },
    // { price: 200, type: 'resistance' },
    // ]
    */
    groupAndFilterLevels(potentialLevels) {
        const tolerance = 0.01; // Tolerance for grouping similar levels (e.g., 1%)
        const levels = [];
        
        for (const potentialLevel of potentialLevels) {
            let isGrouped = false;
            
            for (const level of levels) {
                if (Math.abs(potentialLevel.price - level.price) / level.price <= tolerance) {
                    level.price = (level.price * level.count + potentialLevel.price) / (level.count + 1);
                    level.count++;
                    isGrouped = true;
                    break;
                }
            }
            
            if (!isGrouped) {
                levels.push({ price: potentialLevel.price, type: potentialLevel.type, count: 1 });
            }
        }
        
        return levels.map((level) => ({ price: level.price, type: level.type }));
    }
    
    /**
    * detectCandlestickPatterns - Detects candlestick patterns in the provided price data.
    * 
    * @param {Array} data Array of price data, where each element contains { high, low, open, close }.
    * @returns {Map} A Map of detected candlestick patterns, where the key is the index and the value is an array of matched patterns.
    * This function takes an array of price data and analyzes it for candlestick patterns. It returns an
    * array of detected patterns along with the index at which the pattern was found.
    */
    detectCandlestickPatterns(data) {
        const patterns = new Map();
        const checkFunctions = [
            isHammerOrHangingMan,
            isBullishOrBearishHarami,
            isMarubozu,
            isThreeWhiteSoldiers,
            isEveningStar,
            isBullishEngulfing,
            isBearishEngulfing,
            isDarkCloudCover,
            isPiercingLine,
            isShootingStar,
            isInvertedHammer,
            isTweezerTops,
            isTweezerBottoms,
            isThreeInsideUp,
            isThreeInsideDown,
            isThreeOutsideUp,
            isThreeOutsideDown,
            isAbandonedBaby,
            isDoji,
            isKicker,
            isTwoCrows,
            isRisingThreeMethods,
            isFallingThreeMethods,
            isMorningStar,
            isThreeBlackCrows   
        ];
        
        for (let i = 2; i < data.length; i++) {
            const matchedPatterns = checkFunctions.flatMap(checkFn => checkFn(data, i) || []);
            if (matchedPatterns.length > 0) {
                patterns.set(i, matchedPatterns);
            }
        }
        
        return patterns;
    }
}

export default CandlestickAnalyzer;