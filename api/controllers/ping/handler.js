const { readLists, getLists } = require(`../../../db`);

const countUnseen = (lists) => {
	const reduced = Object.keys(lists).reduce(
		(acc, key) => {
			const [identifier] = key.split("_");
			const unseen = lists[key].filter(({ unseen }) => !!unseen);
			const seen = lists[key].filter(({ unseen }) => !unseen);
			acc.categories[identifier] = {
				...acc.categories[identifier],
				[key]: { seen, unseen },
			};
			acc.categoriesCount = {
				...acc.categoriesCount,
				[key]: unseen?.length,
			};
			acc[`${identifier}Count`] =
				acc[`${identifier}Count`] + unseen?.length;

			return acc;
		},
		{
			olxCount: 0,
			besplatkaCount: 0,
			domriaCount: 0,
			categories: {
				olx: {},
				besplatka: {},
				domria: {},
			},
			categoriesCount: {},
		}
	);

	return reduced;
};
const ping = async (req, res) => {
	try {
		const { category = false } = req.query;
		const lists = category ? await readLists(category) : await getLists();
		const result = category ? lists : countUnseen(lists);
		res.apiResponse(
			JSON.stringify({
				result,
			})
		);
	} catch (error) {
		console.log("ping", error);
	}
};

module.exports = { ping };
