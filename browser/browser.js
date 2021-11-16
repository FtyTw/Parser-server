const puppeteer = require("puppeteer");

async function startBrowser() {
    try {
        console.log("Opening the browser......");
        const browser = await puppeteer.launch({
            // executablePath: "/usr/bin/chromium-browser",
            headless: true,
            args: ["--disable-setuid-sandbox"],
            ignoreHTTPSErrors: true,
        });
        return browser;
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
}

module.exports = {
    startBrowser,
};
