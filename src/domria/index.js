const axios = require("axios");
const {
	constants: { domria_key: YOUR_API_KEY },
} = require("../utils");

const path_domria = "https://dom.ria.com/uk/";

const { writeToIds, readIds } = require("../db");

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

const getAnnDataByIdPromises = (id) =>
	axios(`https://developers.ria.com/dom/info/${id}?api_key=${YOUR_API_KEY}`);

const getAnnDataById = async (items, category) => {
	try {
		const promises = items.map(getAnnDataByIdPromises);
		const result_data = await Promise.all(promises);
		const prettified_data = result_data.map(
			({
				data: {
					description,
					description_uk,
					beautiful_url,
					street_name,
					realty_id,
				},
			}) => {
				const desc =
					description ||
					description_uk ||
					street_name ||
					"Нет описания";

				return {
						title: desc.slice(0, 80),
						uri: `${path_domria}${beautiful_url}`,
						realty_id,
				};
			}
		);

		return {
			[`domria_${category}`] : prettified_data
		};
	} catch (error) {
		console.log("getAnnDataById", error);
	}
};
const handleParamsRequest = async (type, place) => {
	try {
		console.log(`Domria:Requesting the ${type} from the ${place}`);
		const result = await getItems({
			...search[type],
			...search[place],
		});
		const {
			data: { items },
		} = result;
		console.log(`Domria:Got an items of ${type} from the ${place}`);
		const category = `${place}_${type}`;

		const storedIds = (await readIds(category)) || [];
		const newIds = items.filter((id) => !storedIds.includes(id));
		const sum = [...storedIds, ...newIds];
		console.log("Got some new items ", newIds.length);
		if (newIds?.length) {
			await writeToIds(category, sum);
		}
		return getAnnDataById(newIds, category) ;
		// return !items.length ? items : getAnnDataById(items);
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
	handleParamsRequest
};
