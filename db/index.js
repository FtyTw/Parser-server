const fs = require("fs");
const path = require("path");

const readAndCleanStorage = () => {
	const localPath = path.resolve(__dirname, `./lists.json`);
	const backupPath = path.resolve(__dirname, `./backup.json`);
	// const testPath = localPath.replace("/db", "");
	fs.readFile(localPath, "utf8", (error, file) => {
		if (error) {
			console.log(error);
			return;
		} else {
			const result = JSON.parse(file);
			const filtered = {};
			for (let key in result) {
				if (result[key]?.length) {
					const test = result[key].filter(
						({ unseen, timestamp }) =>
							new Date().getUTCDate() -
								new Date(timestamp).getUTCDate() <
								8 || unseen !== 0
					);
					filtered[key] = test;
				}
			}
			fs.writeFile(backupPath, JSON.stringify(result), "utf8", () => {
				console.log(`stored to ${backupPath}`);
			});
			fs.writeFile(localPath, JSON.stringify(filtered), "utf8", () => {
				console.log(`stored to ${localPath}`);
			});
		}
	});
};

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

const writeToErrors = (field, data) => writeToFile("error", field, data);

const getLists = () => {
	try {
		const listsPath = path.resolve(__dirname, `./lists.json`);
		return new Promise((resolve, reject) => {
			fs.readFile(listsPath, "utf8", (error, file) => {
				if (error) {
					createDefaultFile(listsPath, (defaultFile) => {
						resolve(defaultFile);
					});
					return;
				} else {
					const result = JSON.parse(file);
					resolve(result);
				}
			});
		});
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
const readErrors = (field) => readFromFile("error");

module.exports = {
	writeToLists,
	writeToAnnouncements,
	writeToErrors,
	readFromFile,
	readAnnouncements,
	readLists,
	readErrors,
	getLists,
	readAndCleanStorage,
};
