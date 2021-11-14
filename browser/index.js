const browserObject = require("./browser");
const scraperController = require("./pageController");
const sendNotification = require("../onesignal");
const {
	writeToLists,
	writeToAnnouncements,
	readAnnouncements,
} = require("../db");
const parseConfigs = require("./parseConfigs");
const browserInstance = browserObject.startBrowser();

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

const getUrls = async (url, config, title) => {
	try {
		const result = await scraperController(browserInstance, url, config);

		matcher(title, result);
	} catch (error) {
		console.log("getUrls", error);
	}
};

const enableParser = () => {
	try {
		parseConfigs.forEach(({ url, config, title }, index) => {
			setTimeout(() => {
				getUrls(url, config, title);
			}, (index + 1) * 60000);
		});
	} catch (error) {
		console.log("enableParser", error);
	}
};

module.exports = {
	enableParser,
};
