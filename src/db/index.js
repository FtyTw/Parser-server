const fs = require("fs");
const path = require("path");
const { ErrorLog, InfoLog } = require("../logs");

const createPath = (filename) =>
	path.join(__dirname, "..", "..", "storage", `${filename}.json`);

const readAndCleanStorage = () => {
	const localPath = createPath("lists");
	const backupPath = createPath("backup");

	fs.readFile(localPath, "utf8", (error, file) => {
		if (error) {
			ErrorLog("readAndCleanStorage", error);
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
				InfoLog("readAndCleanStorage", `stored to ${backupPath}`);
			});
			fs.writeFile(localPath, JSON.stringify(filtered), "utf8", () => {
				InfoLog("readAndCleanStorage", `stored to ${localPath}`);
			});
		}
	});
};

const clearUnseen = () => {
	const localPath = createPath("lists");
	const backupPath = createPath("backup");

	fs.readFile(localPath, "utf8", (error, file) => {
		if (error) {
			ErrorLog("readAndCleanStorage", error);
			return;
		} else {
			const list = JSON.parse(file);
			const cleared = {};
			for (key in list) {
				cleared[key] = list[key].map((item) => {
					item.unseen = 0;
					return item;
				});
			}
			fs.writeFile(localPath, JSON.stringify(cleared), "utf8", () => {
				InfoLog("clearUnseen", `stored to ${localPath}`);
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
		ErrorLog("createDefaultFile", error);
	}
};

const writeToFile = (type, field, data = null) => {
	try {
		const promise = new Promise((resolve) => {
			const localPath = createPath(type);
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
					InfoLog("writeToFile", `stored to ${localPath}`);
					resolve();
				});
			});
		});
		return promise;
	} catch (error) {
		ErrorLog("writeToFile:" + type, error);
	}
};

const writeToLists = (field, data) => writeToFile("lists", field, data);
const writeToIds = (field, data) => writeToFile("ids", field, data);

const writeToAnnouncements = (field, data) =>
	writeToFile("announcements", field, data);

const writeToErrors = (field, data) => writeToFile("error", field, data);

const getLists = () => {
	try {
		const listsPath = createPath("lists");
		// path.resolve(__dirname, `./lists.json`);
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
		ErrorLog("getLists", error);
	}
};

const readFromFile = (type, field) => {
	try {
		const localPath = createPath(type);
		const promise = new Promise((resolve, reject) => {
			fs.readFile(localPath, "utf8", async (error, file) => {
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
			});
		});

		return promise;
	} catch (error) {
		ErrorLog("readFromFile:" + type, error);
	}
};

const readAnnouncements = (field) => readFromFile("announcements", field);
const readLists = (field) => readFromFile("lists", field);
const readIds = (field) => readFromFile("ids", field);
const readErrors = (field) => readFromFile("error");

module.exports = {
	writeToLists,
	writeToAnnouncements,
	writeToErrors,
	readFromFile,
	readAnnouncements,
	readLists,
	readErrors,
	readIds,
	getLists,
	readAndCleanStorage,
	writeToIds,
	clearUnseen,
};
