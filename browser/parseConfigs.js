const Types = [
	{ type: "kvartiry/prodazha-kvartir", title: "appartaments" },
	{ type: "doma/prodazha-domov", title: "houses" },
	{ type: "komnaty/prodazha-komnat", title: "flats" },
];
const olx_config = {
	mainSelector: ":not(.wrapper>.emptynew)+.wrapper>.content",
	subSelector: ".title-cell",
	emptySelector: ".emptynew",
};
const besplatka_config = {
	mainSelector: ".messages-list",
	subSelector: ".d-title",
	emptySelector: ".no-data",
};
const olx_places = [
	//
	"odessa",
	"kryzhanovka_43791", //дома, квартиры, комнаты
	"leski_43795", //дома, квартиры, комнаты
	"fontanka", //дома, квартиры, комнаты
	"shevchenko_44347", //
	"vapnyarka_43741", //дома,
	"gvardeyskoe_43751", //дома
	"korsuntsy", //проверить корсунцы, оставить только дома
	"krasnoselka_43787", //дома, проверить
	"novaya-dofinovka", //только дома
	"aleksandrovka_43819", //квартиры, дома
	"pervomayskoe_43827", //дома
	"sverdlovo_43841", //дома
];
const olxUrl = (place, type) =>
	encodeURI(
		`https://www.olx.ua/nedvizhimost/${type}/${place}/?search[private_business]=private&search[order]=created_at%3Adesc${
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

const besplatkaConfigs = Types.map(({ type, title }) => {
	const [, hardType] = type.split("/");
	return {
		title: `besplatka_odessa_${title}`,
		url: `https://besplatka.ua/ru/odessa/nedvizhimost/${hardType}/suvorovskii-r-n/ot-sobstvennika?currency=USD`,
		config: besplatka_config,
	};
});

const olx_exceptions = [
	//
	"olx_korsuntsy_flats",
	"olx_korsuntsy_appartaments",
	"olx_vapnyarka_flats",
	"olx_vapnyarka_appartaments",
	"olx_gvardeyskoe_flats",
	"olx_gvardeyskoe_appartaments",
	"olx_krasnoselka_flats",
	"olx_krasnoselka_appartaments",
	"olx_novaya-dofinovka_flats",
	"olx_novaya-dofinovka_appartaments",
	"olx_aleksandrovka_flats",
	"olx_pervomayskoe_appartaments",
	"olx_pervomayskoe_flats",
	"olx_sverdlovo_flats",
	"olx_sverdlovo_appartaments",
];

//TODO discuss possible useless categories
// 'olx_shevchenko_appartaments',
//  'olx_shevchenko_houses',
//  'olx_shevchenko_flats',
//  'olx_aleksandrovka_appartaments',
//  'domria_kominternovo_flats'

const parseConfigs = [
	//
	...olxConfigs.filter(({ title }) => !olx_exceptions.includes(title)),
	...domriaConfigs,
	...besplatkaConfigs,
];

module.exports = parseConfigs;
