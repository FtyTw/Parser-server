const browserObject = require("./browser");
const scraperController = require("./pageController");
const sendNotification = require("../onesignal");
const {
	writeToLists,
	writeToAnnouncements,
	readAnnouncements,
} = require("../db");
const parseConfigs = require("./parseConfigs");

const matcher = async (type, result) => {
	try {
		const stored = await readAnnouncements(type);
		const [{ uri = null, title }] = result;
		if (stored !== uri) {
			console.log("send notification");
			sendNotification({ uri, title });
			writeToLists(type, result);
			writeToAnnouncements(type, uri);
		}
	} catch (error) {
		console.log("matcher", error);
	}
};

const getUrls = async (url, config, title, browserInstance) => {
	try {
		const result = await scraperController(browserInstance, url, config);

		matcher(title, result);
	} catch (error) {
		console.log("getUrls", error);
	}
};

let parserCounter = 0;
const enableParser = () => {
	try {
		parserCounter =
			parserCounter >= parseConfigs.length ? 0 : parserCounter;
		const browserInstance = browserObject.startBrowser();
		const { url, config, title } = parseConfigs[parserCounter];
		parserCounter += 1;
		getUrls(url, config, title, browserInstance);
	} catch (error) {
		console.log("enableParser", error);
	}
};

module.exports = {
	enableParser,
};
