const cron = require("node-cron");
const shelljs = require("shelljs");
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
	});
	const cleanerHour = 22;
	cron.schedule(`01 ${cleanerHour} * * *`, () => {
		const nextCounter = browser.getCurrentParseCounter();
		parser.stop();
		readAndCleanStorage();
		setTimeout(() => {
			shelljs.exec(
				`COUNTER=${nextCounter} pm2 restart server --update-env`
			);
		}, 60000);
	});
};

module.exports = { enable };
