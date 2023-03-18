import puppeteer from "puppeteer";

describe("E2E - Form interaction", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:8000"); // Załóżmy, że aplikacja działa na porcie 3000
  });

  afterAll(async () => {
    await browser.close();
  });

  test("User can fill in the form and submit it", async () => {
    await page.type("#symbol", "BTCUSDT");
    await page.type("#start-date", "2021-09-01");
    await page.type("#end-date", "2021-09-30");
    await page.select("#interval", "1h");

    const submitButton = await page.$("button[type=submit]");
    await submitButton.click();

    // Dodaj kod sprawdzający, czy po wysłaniu formularza dane są przetwarzane poprawnie
    // Na przykład, możemy sprawdzić, czy wykres został wygenerowany
    const chart = await page.waitForSelector("#chart", { timeout: 5000 });
    expect(chart).toBeTruthy();
  });
});
  