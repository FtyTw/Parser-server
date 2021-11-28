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
		title: "olx",
		url: "https://www.olx.ua/nedvizhimost/kvartiry/prodazha-kvartir/odessa/?search%5Bpaidads_listing%5D=1",
		config: {
			mainSelector: ".content",
			subSelector: ".title-cell",
		},
	},
	{
		title: "besplatka",
		url: "https://besplatka.ua/odessa/nedvizhimost/prodazha-kvartir/suvorovskii-r-n",
		config: {
			mainSelector: ".messages-list",
			subSelector: ".msg-inner:not(.top) .d-title",
		},
	},
];
module.exports = parseConfigs;
