const parseConfigs = [
	{
		//
		title: "domria_odessa_houses",
		url: "houses",
		config: "odessa",
	},
	{
		//
		title: "domria_odessa_flats",
		url: "flats",
		config: "odessa",
	},
	{
		title: "domria_odessa_appartaments",
		url: "appartaments",
		config: "odessa",
	},
	{
		title: "domria_kominternovo_houses",
		url: "houses",
		config: "kominternovo",
	},
	{
		title: "domria_kominternovo_appartaments",
		url: "appartaments",
		config: "kominternovo",
	},
	{
		title: "domria_kominternovo_flats",
		url: "flats",
		config: "kominternovo",
	},

	{
		title: "olx_odessa_appartaments",
		url: "https://www.olx.ua/nedvizhimost/kvartiry/prodazha-kvartir/odessa/?search%5Bprivate_business%5D=private&search%5Bdistrict_id%5D=91&currency=USD",
		config: {
			mainSelector: ".content",
			subSelector: ".title-cell",
		},
	},
	{
		title: "olx_odessa_houses",
		url: "https://www.olx.ua/nedvizhimost/doma/prodazha-domov/odessa/?search%5Bprivate_business%5D=private&search%5Bdistrict_id%5D=91&currency=USD",
		config: {
			mainSelector: ".content",
			subSelector: ".title-cell",
		},
	},
	{
		title: "olx_odessa_flats",
		url: "https://www.olx.ua/nedvizhimost/komnaty/prodazha-komnat/odessa/?search%5Bprivate_business%5D=private&search%5Bdistrict_id%5D=91&currency=USD",
		config: {
			mainSelector: ".content",
			subSelector: ".title-cell",
		},
	},
	{
		title: "besplatka_odessa_appartaments",
		url: "https://besplatka.ua/ru/odessa/nedvizhimost/prodazha-kvartir/suvorovskii-r-n/ot-sobstvennika",
		config: {
			mainSelector: ".messages-list",
			subSelector: ".msg-inner:not(.top) .d-title",
		},
	},
	{
		title: "besplatka_odessa_houses",
		url: "https://besplatka.ua/ru/odessa/nedvizhimost/prodazha-domov/suvorovskii-r-n/ot-sobstvennika",
		config: {
			mainSelector: ".messages-list",
			subSelector: ".msg-inner:not(.top) .d-title",
		},
	},
	{
		title: "besplatka_odessa_flats",
		url: "https://besplatka.ua/ru/odessa/nedvizhimost/prodazha-komnat/suvorovskii-r-n/ot-sobstvennika",
		config: {
			mainSelector: ".messages-list",
			subSelector: ".msg-inner:not(.top) .d-title",
		},
	},
];
module.exports = parseConfigs;
