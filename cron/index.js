const cron = require("node-cron");
const browser = require("../browser");

const enable = () => {
	const interval = 2;
	const when = () => new Date().toISOString();
	console.log(`cron enabled at ${when()}`);
	cron.schedule(`*/${interval} * * * *`, () => {
		console.log(`running a task every ${interval} minute ${when()}`);
		browser.enableParser();
	});
};

module.exports = { enable };
