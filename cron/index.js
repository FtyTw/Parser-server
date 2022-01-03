const cron = require("node-cron");
const shelljs = require("shelljs");
const browser = require("../browser");
const { readAndCleanStorage } = require("../db");

const enable = () => {
	const interval = 1;
	const smallInterval = 30;
	const when = () => new Date().toLocaleString("uk-UA");
	console.log(`cron enabled at ${when()}`);
	const parser = cron.schedule(`*/${smallInterval} * * * * *`, () => {
		console.log(`running a task every ${smallInterval} seconds ${when()}`);
		browser.enableParser();
	});

	cron.schedule(`0 */59 * * * *`, () => {
		const nextCounter = browser.getCurrentParseCounter();
		parser.stop();
		// readAndCleanStorage();
		console.log("killing all chromes");
		shelljs.exec(`pkill -9 chrome`);
		setTimeout(() => {
			console.log(
				"restarting the process with next counter:",
				nextCounter
			);
			shelljs.exec(
				`COUNTER=${nextCounter} pm2 restart server --update-env`
			);
		}, 30000);
	});
};

module.exports = { enable };
