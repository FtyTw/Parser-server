const cron = require("node-cron");
const browser = require("../browser");

const enable = () => {
	const interval = 5;
	console.log("cron enabled");
	cron.schedule(`*/${interval} * * * *`, () => {
		console.log(`running a task every ${interval} minute`);
		browser.enableParser();
	});
};

module.exports = { enable };
