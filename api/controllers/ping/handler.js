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

const catsCount = (lists) => {
	const reduced = Object.keys(lists).reduce(
		(acc, key) => {
			const [identifier] = key.split("_");
			const unseen = lists[key].filter(({ unseen }) => !!unseen);

			acc[`${identifier}Count`] =
				acc[`${identifier}Count`] + unseen?.length;
			acc[`${identifier}Categories`][unseen?.length ? "unshift" : "push"](
				key
			);
			acc.categoriesCount = {
				...acc.categoriesCount,
				[key]: unseen?.length,
			};
			return acc;
		},
		{
			olxCount: 0,
			besplatkaCount: 0,
			domriaCount: 0,
			olxCategories: [],
			besplatkaCategories: [],
			domriaCategories: [],
			categoriesCount: {},
		}
	);
	return reduced;
};
const ping = async (req, res) => {
	try {
		const { category = false, catOnly } = req.query;
		const lists = await getLists();
		if (catOnly) {
			const categories = catsCount(lists);
			res.apiResponse(JSON.stringify(categories));
			return;
		}
		if (category) {
			const categoryArr = await readLists(category);
			categoryArr.sort(({ unseen: a }, { unseen: b }) => b - a);
			res.apiResponse(JSON.stringify(categoryArr));
			return;
		}

		res.apiResponse(JSON.stringify(lists));
	} catch (error) {
		console.log("ping", error);
	}
};

module.exports = { ping };
