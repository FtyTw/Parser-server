const ping = async (req, res) => {
	const announcements = require(`../../../db/announcements.json`);
	const lists = require(`../../../db/lists.json`);
	res.apiResponse(
		JSON.stringify({
			announcements,
			lists,
		})
	);
};

module.exports = { ping };
