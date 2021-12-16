const cron = require("node-cron");
const browser = require("../browser");
const { readAndCleanStorage } = require("../db");
const enable = () => {
	const interval = 1;
	const smallInterval = 30;
	const when = () => new Date().toISOString();
	console.log(`cron enabled at ${when()}`);
	const parser = cron.schedule(`*/${smallInterval} * * * * *`, () => {
		console.log(`running a task every ${smallInterval} seconds ${when()}`);
		browser.enableParser();
		console.log(browser.getCurrentParseCounter());
	});
	const cleanerHour = 22;
	cron.schedule(`26 ${cleanerHour} * * *`, () => {
		parser.stop();
		console.log("stop");
		setTimeout(() => {
			parser.start();
			console.log("timeout");
		}, 60000);
	});
};

module.exports = { enable };
