==> index.html <==
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Price Pattern Analyzer</title>
</head>
<body>
  <form id="user-input-form">
    <label for="symbol">Podaj symbol par walutowych:</label>
    <input type="text" id="symbol" name="symbol" value="BTCUSDT" required>
    <br>
    <label for="start-date">Podaj datę początkową (RRRR-MM-DD):</label>
    <input type="date" id="startDate" name="startDate" value="2022-01-01" required>
    <br>
    <label for="end-date">Podaj datę końcową (RRRR-MM-DD):</label>
    <input type="date" id="endDate" name="endDate" value="2022-12-31" required>
    <br>
    <label for="interval">Podaj interwał (np. 1m, 5m, 1h, 1d):</label>
    <input type="text" id="interval" name="interval" value="1d" required>
    <br>
    <button type="submit">Analizuj wzorce cen</button>
  </form>
  <div id="plot"></div>
  <script type="module" src="dist/bundle.js"></script>
</body>
</html>

==> package.json <==
{
  "name": "CryptoMasterBot",
  "version": "1.0.0",
  "description": "Bot Project to sample data to external analysis",
  "main": "app.mjs",
  "dependencies": {
    "axios": "^1.3.0",
    "plotly.js-dist": "^2.6.5"
  },
  "scripts": {
    "start": "esbuild js/app.mjs --bundle --outfile=dist/bundle.js --servedir=. --watch"
  },
  "author": "Milo",
  "license": "ISC"
}
