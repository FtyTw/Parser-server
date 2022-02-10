const http = require("http");
const app = require("./src/api/app");
const cron = require("./src/cron");
const { when } = require("./src/utils");

const appPort = process.env.PORT || 8080;
app.set("port", appPort);

http.createServer(app).listen(appPort, () => {
	console.log(
		`Node app running at localhost:${appPort} at the ${when()} within ${
			process.env.NODE_ENV || "production"
		} environment`
	);
	cron.enable();
});
