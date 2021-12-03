const Types = [
	{ type: "kvartiry/prodazha-kvartir", title: "appartaments" },
	{ type: "doma/prodazha-domov", title: "houses" },
	{ type: "komnaty/prodazha-komnat", title: "flats" },
];
const olx_config = {
	mainSelector: ".content",
	subSelector: ".title-cell",
};
const besplatka_config = {
	mainSelector: ".messages-list",
	subSelector: ".d-title",
};
const olx_places = [
	//
	"odessa",
	"kryzhanovka_43791",
	"leski_43795",
	"fontanka",
	"shevchenko_44347",
	"vapnyarka_43741",
	"gvardeyskoe_43751",
	"korsuntsy",
	"krasnoselka_43787",
	"novaya-dofinovka",
	"aleksandrovka_43819",
	"pervomayskoe_43827",
	"sverdlovo_43841",
];

const olxUrl = (place, type) =>
	encodeURI(
		`https://www.olx.ua/nedvizhimost/${type}/${place}/?search[private_business]=private${
			place.includes("odessa") ? "&search[district_id]=91" : ""
		}&currency=USD`
	);

const olxConfigs = olx_places
	.map((place) => {
		const [simplePlace] = place.split("_");
		return Types.map(({ type, title }) => {
			const url = olxUrl(place, type);

			return {
				title: `olx_${simplePlace}_${title}`,
				url: olxUrl(place, type),
				config: olx_config,
			};
		});
	})
	.flat();

const domriaPlaces = ["odessa", "kominternovo"];

const domriaConfigs = domriaPlaces
	.map((place) =>
		Types.map(({ title }) => ({
			title: `domria_${place}_${title}`,
			url: title,
			config: place,
		}))
	)
	.flat();

const besplatkaConfigs = Types.map(({ type }) => {
	const [, hardType] = type.split("/");
	return {
		title: "besplatka_odessa_appartaments",
		url: `https://besplatka.ua/ru/odessa/nedvizhimost/${hardType}/suvorovskii-r-n/ot-sobstvennika?currency=USD`,
		config: besplatka_config,
	};
});

const parseConfigs = [
	//
	...olxConfigs,
	...domriaConfigs,
	...besplatkaConfigs,
];
module.exports = parseConfigs;
