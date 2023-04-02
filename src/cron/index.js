const cron = require("node-cron");
const shelljs = require("shelljs");
const browser = require("../browser");
const { when } = require("../utils");
const { readAndCleanStorage } = require("../db");

const enable = () => {
	const interval = 1;
	const smallInterval = 30;
	console.log(`cron enabled at ${when()}`);
	const parser = cron.schedule(`*/${smallInterval} * * * * *`, async () => {
		console.log(`running a task every ${smallInterval} seconds ${when()}`);
		await browser.enableParser();
	});
};

module.exports = { enable };
