const cron = require("node-cron");
const browser = require("../browser");

const enable = () => {
	console.log("cron enabled");
	cron.schedule("*/5 * * * *", () => {
		console.log("running a task every 2 minute");
		browser.enableParser();
	});
};

module.exports = { enable };
