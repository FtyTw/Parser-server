const axios = require("axios");
const path_domria = "https://dom.ria.com/uk/";
const YOUR_API_KEY = "vI0R8HtF1c7HwZGdV8WXitsr0scCJBIz9oolk2La";
const instance = axios.create({
	baseURL: `https://developers.ria.com/dom/search`,
	params: {
		api_key: YOUR_API_KEY,
		operation: 1,
		"characteristic[1437]": 1436,
		limit: 20,
	},
});

const districts = {
	suvorovskiy: 15538,
	fontanka: 17556,
	kryzhanivka: 17790,
	leski: 17633,
	aleksandrovka: 18247,
	bolshevik: 17860,
	zhevahova_gora: 17861,
	kuyalnik: 17863,
	limanchik: 17864,
	luzanovka: 15539,
	kotovskogo: 15249,
	peresip: 15540,
	slobodka: 15809,
	shevchenka: 17866,
	limanskiy: 17789,
	ilichanka: 17630,
};

const out_of_city_districts = {
	ilichivka: 8841,
	vapnyarka: 8835,
	vizirka: 8836,
	gvardeiskoe: 8838,
	korsunci: 8847,
	krasnosilka: 8849,
	kryzhanivka: 8851,
	liski: 8853,
	novaya_dofinivka: 8855,
	aleksandrovka: 8833,
	pervomaiskoe: 8860,
	sverdlovo: 8862,
	svitle: 16037,
	fontanka: 8866,
};
const city_district_ids = Object.values(districts);
const out_of_city_district_ids = Object.values(out_of_city_districts);
const search = {
	appartaments: {
		category: 1,
		realty_type: 2,
	},
	houses: {
		category: 4,
		realty_type: 5,
	},
	flats: {
		category: 1,
		realty_type: 3,
	},
	odessa: {
		state_id: 12,
		city_id: 12,
		district_id: city_district_ids,
	},
	kominternivske: {
		state_id: 12,
		city_id: 345,
		district_id: out_of_city_district_ids,
	},
};

const getItems = async (params) => await instance({ params });

const getAnnDataById = (id) =>
	axios(`https://developers.ria.com/dom/info/${id}?api_key=${YOUR_API_KEY}`);

const handleParamsRequest = async (type, place) => {
	try {
		const result = await getItems({
			...search[type],
			...search[place],
		});
		const {
			data: { items },
		} = result;
		const ids = items.slice(0, 2);
		const promises = ids.map(getAnnDataById);
		const result_data = await Promise.all(promises);
		const prettified_data = result_data.map(
			({
				data: { description, description_uk, beautiful_url, ...rest },
			}) => ({
				title: description || description_uk,
				uri: `${path_domria}${beautiful_url}`,
				// rest,
			})
		);

		return prettified_data;
	} catch (error) {
		console.log("handleParamsRequest", error.message);
	}
};

const getOdessaAppartaments = () =>
	handleParamsRequest("appartaments", "odessa");

const getOdessaHouses = () => handleParamsRequest("houses", "odessa");

const getOdessaFlats = () => handleParamsRequest("flats", "odessa");

const getKominternovoAppartaments = () =>
	handleParamsRequest("appartaments", "kominternivske");

const getKominternovoHouses = () =>
	handleParamsRequest("houses", "kominternivske");

const getKominternovoFlats = () =>
	handleParamsRequest("flats", "kominternivske");

module.exports = {
	getOdessaAppartaments,
	getOdessaHouses,
	getOdessaFlats,
	getKominternovoAppartaments,
	getKominternovoHouses,
	getKominternovoFlats,
};
