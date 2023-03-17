const readline = require("readline");

function getUserInput() {
  return new Promise(async (resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    function question(prompt, defaultValue) {
      return new Promise((resolve) => {
        rl.question(`${prompt} (domyślnie: ${defaultValue}): `, (answer) => {
          resolve(answer || defaultValue);
        });
      });
    }

    const symbol = await question("Podaj symbol par walutowych", "BTCUSDT");
    const startDate = await question("Podaj datę początkową (RRRR-MM-DD)", "2021-01-01");
    const endDate = await question("Podaj datę końcową (RRRR-MM-DD)", "2021-12-31");
    const interval = await question("Podaj interwał (np. 1m, 5m, 1h, 1d)", "1d");

    rl.close();

    resolve({ symbol, startDate, endDate, interval });
  });
}

module.exports = {
  getUserInput,
};
