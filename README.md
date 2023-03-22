# Price Action Trading Application

This application helps users analyze financial instruments using price action techniques.

## Features

- Visualize price data on charts
- Identify support and resistance levels
- Analyze candlestick patterns
- Execute and manage trades based on price action signals
- Review and analyze trade performance

## Running the Application

1. Install `serve`: `npm install -g serve`
2. Run the application: `npm start`
3. Serve the application: `npm run serve`
4. Open your browser and navigate to `http://localhost:3000`

## CORS Proxy

This application uses cors-anywhere to bypass CORS restrictions. To set up cors-anywhere, follow these steps:

1. Install cors-anywhere: `npm install cors-anywhere`
2. Create a new file named `cors-proxy.js` in the root directory of the project and add the following content:

```javascript
const cors_proxy = require("cors-anywhere");

cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
}).listen(8080, () => {
  console.log("CORS Anywhere server is running on port 8080");
});
```

Add a new script in package.json to start the CORS proxy server:

```json

"scripts": {
  "start-cors-proxy": "node cors-proxy.js",
}
```

## Config file
Config file template 

```javascript
const config = {
  apiUrl: 'https://api.binance.com',
  apiKey: 'xxxxx',
  apiSecret: 'yyyy',
};

export default config;
```