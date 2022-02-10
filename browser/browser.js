const puppeteer = require("puppeteer");
const shelljs = require("shelljs");

async function startBrowser(parserCounter) {
    try {
        console.log("Opening the browser......");

        const configs = {
            headless: true,
            args: ["--disable-setuid-sandbox", "--disable-dev-shm-usage"],
            ignoreHTTPSErrors: true,
            timeout: 1000,
        };

        if (process.env.NODE_ENV !== "development") {
            configs.executablePath = "/usr/bin/chromium-browser";
        }

        const browser = await puppeteer.launch(configs);
        return browser;
    } catch (err) {
        shelljs.exec(`pkill -9 chrome`);
        shelljs.exec(
            `COUNTER=${parserCounter - 1} pm2 restart server --update-env`
        );
        console.log("Could not create a browser instance => : ", err);
    }
}

module.exports = {
    startBrowser,
};
