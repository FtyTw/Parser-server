const axios = require("axios");
const {
  when,
  constants: { onesignal_app_id: app_id, onesignal_token: token },
} = require("../utils");

const prepareParams = ({ contents, headings, data }) => ({
  method: "post",
  url: "https://onesignal.com/api/v1/notifications",
  data: {
    app_id,
    contents,
    headings,
    included_segments:
      process.env.NODE_ENV === "development" ? ["Test"] : ["Subscribed Users"],
    data,
  },
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Basic ${token}`,
  },
});

const sendNotification = async ({ uri, title, category }) => {
  try {
    const uriFinal = `${uri}cat_split${category}`;
    const params = prepareParams({
      contents: { en: uriFinal },
      headings: { en: title },
      data: {
        type: "single",
        uri: uriFinal,
        title,
      },
    });
    const result = await axios(params);
    console.log(`
      Notification was sent at ${when()}
      Uri is ${uri}
    `);
  } catch (error) {
    console.log("sendNotification", error);
  }
};

const sendMultipleNotifications = async (category, announcements) => {
  try {
    const params = prepareParams({
      contents: { en: `Multiple notifications ${when()}` },
      headings: { en: `Новые объявления (+${announcements.length})` },
      data: {
        type: "multiple",
        announcements: JSON.stringify(announcements),
      },
    });
    const result = await axios(params);
    console.log(`
      Multiple notifications was sent at ${when()}
    `);
  } catch (error) {
    console.log("sendNotification", error);
  }
};

module.exports = { sendNotification, sendMultipleNotifications };
