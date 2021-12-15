const cron = require("node-cron");
const browser = require("../browser");

const enable = () => {
	const interval = 1;
	const smallInterval = 30;
	const when = () => new Date().toLocaleString("uk-UA");
	console.log(`cron enabled at ${when()}`);
	cron.schedule(`*/${smallInterval} * * * * *`, () => {
		console.log(`running a task every ${smallInterval} seconds ${when()}`);
		browser.enableParser();
	});
};

module.exports = { enable };
