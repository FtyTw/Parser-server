const shelljs = require("shelljs");
const { ErrorLog, InfoLog, WarningLog } = require("../logs");

const closeBrowser = async (browser, url) => {
	try {
		const isClosed = await browser.close();
		InfoLog("closeBrowser", `Browser was closed, after visiting ${url}`);
		shelljs.exec(`pkill -9 chrome`);
		shelljs.exec("rm -rf /tmp/snap.chromium/tmp/*");

		return isClosed;
	} catch (error) {
		ErrorLog("closeBrowser", `Error on browser closing: ${error}`);
	}
};

const linksLoader = async (page, config, browser, url) => {
	try {
		const prevent = await page.waitForSelector(config.emptySelector, {
			timeout: 3000,
		});
		WarningLog("linksLoader", "returned empty");
		const isClosed = await closeBrowser(browser, url);
		return [];
	} catch (error) {
		const selector = "a";
		const urls = await page.$$eval(config.subSelector, (links) => {
			links = links.map((el) => {
				const { href, innerText } = el.querySelector("a");
				return { uri: "" + href, title: innerText };
			});
			return links;
		});
		const isClosed = await closeBrowser(browser, url);

		return urls;
	}
};

const Scrapper = async (url, config, browser) => {
	try {
		const page = await browser.newPage();
		InfoLog("Scrapper", `Navigating to ${url}...`);
		await page.goto(url, { timeout: 20000 });
		await page.waitForSelector(config.mainSelector);
		return linksLoader(page, config, browser, url);
	} catch (error) {
		const isClosed = await closeBrowser(browser, url);
		ErrorLog(
			"Scrapper",
			`Error during navigation to ${url}, the error is ${error}`
		);
	}
};

module.exports = Scrapper;
