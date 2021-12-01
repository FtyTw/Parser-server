const closeBrowser = async (browser, url) => {
	try {
		const isClosed = await browser.close();

		console.log(`Browser was closed, after visiting ${url}`);

		return isClosed;
	} catch (error) {
		console.log(`Error on browser closing: ${error}`);
	}
};

function ScraperObject(url, config) {
	this.url = url;
	this.config = config;

	return {
		scraper: async (browser) => {
			try {
				let page = await browser.newPage();
				console.log(`Navigating to ${this.url}...`);
				await page.goto(this.url);
				await page.waitForSelector(this.config.mainSelector);
				const selector = "a";
				let urls = await page.$$eval(
					this.config.subSelector,
					(links) => {
						links = links.map((el) => {
							const { href, innerText } = el.querySelector("a");
							return { uri: "" + href, title: innerText };
						});
						return links;
					}
				);
				const isClosed = await closeBrowser(browser, this.url);

				return urls;
			} catch (error) {
				console.log(
					`Error during navigation to ${this.url}, the error is ${error}`
				);
			}
		},
	};
}

module.exports = ScraperObject;
