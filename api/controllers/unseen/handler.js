const { readLists, writeToLists } = require(`../../../db`);
const unseen = async (req, res) => {
	try {
		const { category, uri } = req.body;
		const catList = await readLists(category);
		const lookingForIndex = catList.findIndex(
			({ uri: catUri }) => catUri === uri
		);
		const lookingForItem = catList[lookingForIndex];
		lookingForItem.unseen = 0;
		catList.splice(lookingForIndex, 1, lookingForItem);
		await writeToLists(category, catList);
		res.apiResponse(JSON.stringify(catList));
	} catch (error) {
		console.log("ping", error);
	}
};

module.exports = { unseen };
