const routes = require("express").Router();
const { unseen } = require("./handler");

routes.post("/", unseen);

module.exports = routes;
