function ScraperObject(url, config) {
	this.url = url;
	this.config = config;

	return {
		scraper: async (browser) => {
			let page = await browser.newPage();
			console.log(`Navigating to ${this.url}...`);
			await page.goto(this.url);
			await page.waitForSelector(this.config.mainSelector);
			const selector = "a";
			let urls = await page.$$eval(this.config.subSelector, (links) => {
				links = links.map((el) => {
					const { href, innerText } = el.querySelector("a");
					return { uri: "" + href, title: innerText };
				});
				return links;
			});
			// await browser.close()
			return urls;
		},
	};
}

module.exports = ScraperObject;
