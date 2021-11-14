const cron = require("node-cron");
const browser = require("../browser");

const enable = () => {
	console.log("cron enabled");
	cron.schedule("*/30 * * * *", () => {
		console.log("running a task every 30 minute");
		browser.enableParser();
	});
};

module.exports = { enable };
