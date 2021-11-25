const browserObject = require("./browser");
const scraperController = require("./pageController");
const sendNotification = require("../onesignal");
const domRiaHandlers = require("../domria");

const {
	writeToLists,
	writeToAnnouncements,
	readAnnouncements,
} = require("../db");

const parseConfigs = require("./parseConfigs");

const hugeFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

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

const parseUrls = async (url, config, title, browserInstance) => {
	try {
		const result = await scraperController(browserInstance, url, config);

		matcher(title, result);
	} catch (error) {
		console.log("parseUrls", error);
	}
};

const getUrls = async (func, title) => {
	try {
		const result = await func();

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
		if (title !== "domria") {
			parseUrls(url, config, title, browserInstance);
		} else {
			const type = hugeFirstLetter(url);
			const place = hugeFirstLetter(config);
			getUrls(domRiaHandlers[`get${place}${type}`], title);
		}
	} catch (error) {
		console.log("enableParser", error);
	}
};

module.exports = {
	enableParser,
};
