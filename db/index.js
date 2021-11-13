const fs = require("fs");
const path = require("path");

const writeToLists = (field, data) => {
	writeToFile("lists", field, data);
};

const writeToAnnouncements = (field, data) => {
	writeToFile("announcements", field, data);
};

const readFromFile = (type, field) => {
	const promise = new Promise((resolve, reject) => {
		fs.readFile(
			path.resolve(__dirname, `./${type}.json`),
			"utf8",
			(error, file) => {
				if (error) {
					console.log(error);
				}
				console.log("file", JSON.parse(file), typeof file);
				const result = JSON.parse(file);
				if (field in result) {
					resolve(result[field]);
				} else {
					reject("no such a field");
				}
			}
		);
	});

	return promise;
};
const readAnnouncements = (field) => readFromFile("announcements", field);

const writeToFile = (type, field, data) => {
	try {
		const localPath = path.resolve(__dirname, `./${type}.json`);
		fs.readFile(localPath, "utf8", (error, file) => {
			if (error) {
				console.log(error);
			}
			console.log("file", JSON.parse(file), typeof file);
			const store = JSON.parse(file);
			const updated = { ...store };
			updated[field] = data;
			fs.writeFile(localPath, JSON.stringify(updated), "utf8", () =>
				console.log(`stored to ${localPath}`)
			);
		});
	} catch (error) {
		console.log("writeToFile", error);
	}
};

module.exports = {
	writeToLists,
	writeToAnnouncements,
	readFromFile,
	readAnnouncements,
};
