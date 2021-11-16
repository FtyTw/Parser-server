const parseConfigs = [
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
