const browserObject = require("./browser");
const scraperController = require("./pageController");
const { sendNotification, sendMultipleNotifications } = require("../onesignal");
const domRiaHandlers = require("../domria");
const { ErrorLog, InfoLog, WarningLog } = require("../logs");
const axios = require("axios");
const cheerio = require("cheerio");

const removeDuplicates = (array) =>
	[...new Set(array.map(({ uri, title, unseen, timestamp }) => `${uri}splitter${title}splitter${unseen}splitter${timestamp}`))].map(
		(str) => {
			const [uri, title, unseen, timestamp] = str.split("splitter");
			return { uri, title, unseen: Number(unseen), timestamp };
		}
	);

const {
	writeToLists,
	getLists,
	write
} = require("../db");

const { parseConfigs, domriaConfigs} = require("./parseConfigs");

const hugeFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

const notificationCurry = (type) => {
	return ({ uri = null, title }) => {
		try {
			const [simpleType] = type.split("_");
			if (uri && title) {
				sendNotification(
					{
						uri,
						title: `${simpleType}:${title}`,
						category: type,
					},
					true
				);
			}
		} catch (error) {
			ErrorLog("notificationCurry", error);
		}
	};
};

const matcher = async (type, result) => {
	try {
		const stored = [];

		if (newAnn?.length) {
			const mustBeStored = [...newAnn, ...stored];
			InfoLog('Matched: new message notification', `${newAnn?.length} was sent as notification`)
			// return writeToLists(type, mustBeStored);
			// return {type, mustBeStored};

			return

			if (newAnn.length > 1) {
				sendMultipleNotifications(type, newAnn);
			} else {
				const [simpleType] = type.split("_");
				const [{ uri, title }] = newAnn;
				sendNotification({
					uri,
					title: `${simpleType}:${title}`,
					category: type,
				});
			}
		} else {
			WarningLog("matcher", "nothing new was found");
		}
	} catch (error) {
		ErrorLog("matcher", error);
	}
};

const handleLink = (response, title, selector) => {
	try {
		console.log("Performed request to: ", title);
		const $ = cheerio.load(response.data);
		const result = [];
		const mainUrl = title.includes("olx")
			? "https://www.olx.ua"
			: "https://besplatka.ua";
		if ($(selector).length) {
			$(selector).each((i, element) => {
				result.push({
					title: $(element).text(),
					uri: mainUrl + element.attribs.href,
					unseen: 1,
					timestamp: new Date().toISOString()
				});
			});
			const itemsBasedOnTitle = title.includes("olx")
				? result.filter(({ uri }) => {
					return !uri.includes("extended")
				})
				: result;
			const withoutDuplicates = removeDuplicates(itemsBasedOnTitle);
			if (withoutDuplicates.length) {
				return withoutDuplicates
			} else {
				InfoLog(
					"handleLink",
					"there was no any results during link handling"
				);
				return [];
			}
		}
		return result;
	} catch (error) {
		ErrorLog(
			"handleLink",
			"handleOlx error during navigation to: " + title + ":" + error
		);
	}
};

const parseUrls = async (url, config, title, browserInstance) => {
	try {
		const result = await scraperController(browserInstance, url, config);
		const withoutDuplicates = removeDuplicates(result);

		if (result?.length) {
			matcher(title, withoutDuplicates);
		}
	} catch (error) {
		ErrorLog("parseUrls", error);
		parserCounter = parserCounter > 0 ? parserCounter - 1 : 0;
	}
};

const getUrls = async (func, title) => {
	try {
		const result = await func();

		if (result?.length) {
			matcher(title, result);
		}
	} catch (error) {
		ErrorLog("getUrls", error);
	}
};

let parserCounter = parseInt(process.env.COUNTER) || 0;

const getCurrentParseCounter = () => parserCounter;

const getStored = async () => await getLists();

const fetchOAndB = async (promises, newParseConfigs) =>{
	try {
		const promiseAllResults = await Promise.all(promises)
		const results = newParseConfigs.map(({title, config}, index) =>({
				promiseResult: promiseAllResults[index],
				title: title,
				selector: config.mainSelector,
			})
		);
		if(results?.length){
			const storedList = await getStored();
			const sumup = results.reduce((acc,{promiseResult, title, selector}) => {
				const updatedValues = handleLink(promiseResult, title, selector);
				const stored = storedList?.[title] ?? [];

				const newAnn = updatedValues?.filter(({uri: storedUri}, index, array) => {
					const found = !stored?.find(({uri}) => (uri === storedUri) || (uri.match(storedUri)))
					if (found) {
						array[index].unseen = 1;
						array[index].timestamp = new Date().toISOString();
					}
					return found
				})
				if(newAnn?.length){
					if (newAnn.length > 1) {
						sendMultipleNotifications(title, newAnn);
					} else {
						const [simpleType] = title.split("_");
						const [{ uri, title: simpleTitle }] = newAnn;
						sendNotification({
							uri,
							title: `${simpleType}:${simpleTitle}`,
							category: title,
						});
					}
					InfoLog('The next quantity might be sent as messages:', newAnn?.length);
				}
				return {
					...acc,
					[title]: !stored ? newAnn : [...stored, ...newAnn]
				}
			}, {});
			write({...storedList, ...sumup});
		}
	} catch (error) {
		ErrorLog("fetchOAndB", error);
	}
}

// let domRiaSortValues = [];
// const handleDomRia = async () => {
// 		// config: "kominternovo",
// 		// title: "domria_kominternovo_houses",
// 		// url: "houses"
// 	const results = await Promise.all(domriaConfigs.sort(i=>{
// 		if(domRiaSortValues.includes(i.title)){
// 			return -1;
// 		}
// 		return 1;
// 	}).map(({
// 		config,
// 		title,
// 		url
// 	}) => domRiaHandlers.handleParamsRequest(url, config)));
//
// 	results.filter((result, index) => {
// 			if(result === undefined){
// 				domRiaSortValues = [...domRiaSortValues, domriaConfigs[index]?.title];
// 			}
// 			return !!result
// 	});
// 	const allSettled = results.every(i => !!i);
// 	if(allSettled){
// 		domRiaSortValues = [];
// 	}
// 	const stored = await getLists();
// 	const sumup = Object.keys(results).reduce((acc, key) => {
// 		const storedResult = stored[key] ?? [];
// 			const currentResult = acc[key] ? [...acc[key], ...results[key]] : results[key];
// 			const newAnn = currentResult
// 				? currentResult.filter(({ uri }, index, array) => {
// 					const find = !storedResult.find(
// 						({ uri: oldUri }) => uri === oldUri
// 					);
// 					if (find) {
// 						array[index].unseen = 1;
// 						array[index].timestamp = new Date().toISOString();
// 					}
// 					return find;
// 				})
// 				: [];
// 			console.log('newAnn', newAnn);
// 			return {
// 				...acc,
// 				[key]: [...currentResult, ...newAnn]
// 			}
// 		}, {});
// 	write(sumup);
//
// }

const enableParser = async () => {
	try {
		const newParseConfigs = parseConfigs.filter(
			({ title }) => !title.includes('domria')
		).slice(parserCounter, parserCounter + 10);
		
		const promises = newParseConfigs.map(url => axios.get(url.url));

		await fetchOAndB(promises, newParseConfigs);
		// await handleDomRia();
		parserCounter = parserCounter + 10;
		if(parserCounter >= 30) {
			parserCounter = 0;
		}
	} catch (error) {
		ErrorLog("enableParser", error);
	}
};

module.exports = {
	enableParser,
	getCurrentParseCounter,
};
