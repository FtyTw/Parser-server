// Load ENV vars
const path = require("path");
const dotEnvOption = {
	silent: true,
	// path: path.join(__dirname, "env/dev.env"),
};

if (process.env.NODE_ENV === "production") {
	// dotEnvOption.path = path.join(__dirname, "env/prod.env");
}

require("dotenv").config(dotEnvOption);

// Load deps
const express = require("express");
const compress = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

/* Create Express instance
 * ----------------------- */
const app = express();

/* Setup default middlewares
 * ------------------------- */
app.use(compress());
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));

/**
 * Logging
 */
morgan.token("current_user", (req) => (req.user ? req.user.name : "anonymous"));

/* Setup security middlewares
 * -------------------------- */
app.use(helmet.hsts({ maxAge: 10886400000, includeSubDomains: true }));
app.use(cors({ origin: "*" }));

/* Setup DB connection
 * ---------------------------- */

//require('./connections')

/* Controllers
 * ----------- */
require("./controllers")(app);

module.exports = app;
