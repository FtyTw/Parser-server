const pageScraper = require("./pageScrapper");
const { ErrorLog, InfoLog } = require("../logs");

async function scrapeAll(browserInstance, url, config) {
	try {
		const browser = await browserInstance;

		return await pageScraper(url, config, browser);
	} catch (err) {
		const fullError = "Could not resolve the browser instance => : " + err;
		ErrorLog("startBrowser", fullError);
	}
}

module.exports = (browserInstance, url, config) =>
	scrapeAll(browserInstance, url, config);
