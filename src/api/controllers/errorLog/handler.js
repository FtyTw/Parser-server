const { writeToErrors, readErrors } = require(`../../../db`);
const { ErrorLog } = require(`../../../logs`);
const errorLog = async (req, res) => {
	try {
		console.log(req.body);
		const { source, message } = req.body;

		const errorSource = `${source} at ${new Date().toISOString()}`;
		ErrorLog(errorSource, message);
		writeToErrors(errorSource, message);
		res.apiResponse("stored");
	} catch (error) {
		ErrorLog("errorLog", error.message);
	}
};

module.exports = { errorLog };
