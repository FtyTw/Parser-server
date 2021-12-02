const fs = require("fs");
const path = require("path");

const createDefaultFile = (path, callback, field, data = null) => {
	try {
		const defaultFile = {};
		if (field) {
			defaultFile[field] = data;
		}
		fs.writeFile(path, JSON.stringify(defaultFile), "utf8", () => {
			if (callback) {
				callback(defaultFile);
			}
		});
	} catch (error) {
		console.log("createDefaultFile", error);
	}
};

const writeToFile = (type, field, data = null) => {
	try {
		const promise = new Promise((resolve) => {
			const localPath = path.resolve(__dirname, `./${type}.json`);
			fs.readFile(localPath, "utf8", (error, file) => {
				let store;
				if (error) {
					createDefaultFile(
						localPath,
						(defaultFile) => {
							store = defaultFile;
							resolve();
						},
						field,
						data
					);
				} else {
					store = JSON.parse(file);
				}
				const updated = { ...store };
				updated[field] = data;
				fs.writeFile(localPath, JSON.stringify(updated), "utf8", () => {
					console.log(`stored to ${localPath}`);
					resolve();
				});
			});
		});
		return promise;
	} catch (error) {
		console.log("writeToFile", error);
	}
};

const writeToLists = (field, data) => writeToFile("lists", field, data);

const writeToAnnouncements = (field, data) =>
	writeToFile("announcements", field, data);

const getLists = () => {
	try {
		const announcementsPath = path.resolve(
			__dirname,
			`./announcements.json`
		);
		const listsPath = path.resolve(__dirname, `./lists.json`);
		const paths = [announcementsPath, listsPath];
		const promises = paths.map((direction) => {
			return new Promise((resolve, reject) => {
				fs.readFile(direction, "utf8", (error, file) => {
					if (error) {
						createDefaultFile(direction, (defaultFile) => {
							resolve(defaultFile);
						});
						return;
					} else {
						const result = JSON.parse(file);
						resolve(result);
					}
				});
			});
		});

		return promises;
	} catch (error) {
		console.log("getLists", error);
	}
};

const readFromFile = (type, field) => {
	try {
		const localPath = path.resolve(__dirname, `./${type}.json`);
		const promise = new Promise((resolve, reject) => {
			fs.readFile(
				path.resolve(__dirname, `./${type}.json`),
				"utf8",
				async (error, file) => {
					if (error) {
						createDefaultFile(
							localPath,
							(defaultFile) => {
								resolve(defaultFile[field]);
							},
							field
						);
						return;
					} else {
						const result = JSON.parse(file);

						if (field in result) {
							resolve(result[field]);
						} else {
							await writeToFile(type, field);
							resolve(null);
						}
					}
				}
			);
		});

		return promise;
	} catch (error) {
		console.log("readFromFile", error);
	}
};

const readAnnouncements = (field) => readFromFile("announcements", field);
const readLists = (field) => readFromFile("lists", field);

module.exports = {
	writeToLists,
	writeToAnnouncements,
	readFromFile,
	readAnnouncements,
	readLists,
	getLists,
};
