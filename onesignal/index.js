const axios = require("axios");

const sendNotification = async ({ uri, title, category }) => {
  const when = new Date().toLocaleString("uk-UA");
  console.log(`
      Notification was sent at ${when}
      Uri is ${uri}
    `);
  const uriFinal = `${uri}cat_split${category}`;
  try {
    const result = await axios({
      method: "post",
      url: "https://onesignal.com/api/v1/notifications",
      data: {
        app_id: "53dc8ca7-fd32-49c2-8a23-69d68075f36f",
        contents: { en: uriFinal },
        headings: { en: title },
        included_segments:
          process.env.NODE_ENV === "development"
            ? ["Test"]
            : ["Subscribed Users"],
        data: {
          type: "single",
          uri: uriFinal,
          title,
        },
      },
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Basic ZGEyN2NmZjItODEzYy00MTRlLTgzNjYtN2NmMDRkMjZhMzJi",
      },
    });
  } catch (error) {
    console.log("sendNotification", error);
  }
};

const sendMultipleNotifications = async (category, announcements) => {
  const when = new Date().toLocaleString("uk-UA");
  console.log(`
      Multiple notifications was sent at ${when}
    `);
  try {
    const result = await axios({
      method: "post",
      url: "https://onesignal.com/api/v1/notifications",
      data: {
        app_id: "53dc8ca7-fd32-49c2-8a23-69d68075f36f",
        contents: { en: `Multiple notifications ${when}` },
        headings: { en: `Новые объявления (+${announcements.length})` },
        included_segments:
          process.env.NODE_ENV === "development"
            ? ["Test"]
            : ["Subscribed Users"],
        data: {
          type: "multiple",
          announcements,
        },
      },
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Basic ZGEyN2NmZjItODEzYy00MTRlLTgzNjYtN2NmMDRkMjZhMzJi",
      },
    });
  } catch (error) {
    console.log("sendNotification", error);
  }
};

module.exports = { sendNotification, sendMultipleNotifications };
