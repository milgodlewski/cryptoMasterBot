module.exports = {
  transform: {
    "^.+\\.mjs$": "babel-jest",
  },
  moduleNameMapper: {
    "^plotly.js-dist$": "<rootDir>/node_modules/plotly.js-dist/plotly.js",
  },
  moduleFileExtensions: ["mjs", "js"],
  testMatch: ["<rootDir>/src/**/*.test.mjs"],
};
