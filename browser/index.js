const browserObject = require("./browser");
const scraperController = require("./pageController");
const sendNotification = require("../onesignal");
const domRiaHandlers = require("../domria");

const {
	writeToLists,
	writeToAnnouncements,
	readAnnouncements,
	readLists,
} = require("../db");

const parseConfigs = require("./parseConfigs");

const hugeFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

const notificationCurry = (type) => {
	return ({ uri = null, title }) => {
		try {
			const [simpleType] = type.split("_");
			if (uri && title) {
				sendNotification({ uri, title: `${simpleType}:${title}` });
			}
		} catch (error) {
			console.log("notificationCurry", error);
		}
	};
};

const matcher = async (type, result) => {
	try {
		const stored = await readLists(type);
		const newAnn =
			stored && result
				? result.filter(
						({ uri }) =>
							!stored.find(({ uri: oldUri }) => uri === oldUri)
				  )
				: [];
		await writeToLists(type, result);
		if (newAnn?.length) {
			const handler = notificationCurry(type);
			newAnn.forEach(handler);
		}
	} catch (error) {
		console.log("matcher", error);
	}
};

const parseUrls = async (url, config, title, browserInstance) => {
	try {
		const result = await scraperController(browserInstance, url, config);
		const withoutDuplicates = [
			...new Set(
				result.map(({ uri, title }) => `${uri}splitter${title}`)
			),
		].map((str) => {
			const [uri, title] = str.split("splitter");
			return { uri, title };
		});

		if (result?.length) {
			matcher(title, withoutDuplicates);
		}
	} catch (error) {
		console.log("parseUrls", error);
	}
};

const getUrls = async (func, title) => {
	try {
		const result = await func();

		if (result?.length) {
			matcher(title, result);
		}
	} catch (error) {
		console.log("getUrls", error);
	}
};

let parserCounter = 0;
const enableParser = () => {
	try {
		parserCounter =
			parserCounter >= parseConfigs.length ? 0 : parserCounter;
		const { url, config, title } = parseConfigs[parserCounter];
		parserCounter += 1;
		if (!title.includes("domria")) {
			const browserInstance = browserObject.startBrowser();
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
