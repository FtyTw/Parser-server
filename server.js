"use strict";

// Load deps
const http = require("http");
const app = require("./api/app");
const cron = require("./cron");
const fs = require("fs");
// const logger = require('./api/logger')

/* Server creation
 * --------------- */

// Define app port
const appPort = process.env.PORT || 8080;
app.set("port", appPort);

// Create Web server
http.createServer(app).listen(appPort, () => {
	console.log(`Node app running at localhost:${appPort}`);
	console.log(__dirname);
	cron.enable();
});
