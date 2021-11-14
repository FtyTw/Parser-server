const { getLists } = require(`../../../db`);
const ping = async (req, res) => {
	try {
		const promises = getLists();
		const [announcements, lists] = await Promise.all(promises);
		res.apiResponse(
			JSON.stringify({
				announcements,
				lists,
			})
		);
	} catch (error) {
		console.log("ping", error);
	}
};

module.exports = { ping };
