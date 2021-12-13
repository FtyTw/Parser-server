const routes = require("express").Router();
const { errorLog } = require("./handler");

routes.post("/", errorLog);

module.exports = routes;
