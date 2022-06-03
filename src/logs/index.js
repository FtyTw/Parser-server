const chalk = require("chalk");
const types = {
	error: "red",
	info: "cyan",
	warning: "yellow",
};

const Log = ({ type, source, message }) =>
	console.log(chalk[types[type]].bold(`${source} --> ${message}`));

const ErrorLog = (source, message) => Log({ type: "error", source, message });

const InfoLog = (source, message) => Log({ type: "info", source, message });

const WarningLog = (source, message) =>
	Log({ type: "warning", source, message });

module.exports = {
	ErrorLog,
	InfoLog,
	WarningLog,
};
