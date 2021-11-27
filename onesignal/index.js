const axios = require("axios");

const sendNotification = async ({ uri, title }) => {
  const when = new Date().toISOString();
  console.log(`
      Notification was sent at ${when}
      Uri is ${uri}
    `);
  try {
    const result = await axios({
      method: "post",
      url: "https://onesignal.com/api/v1/notifications",
      data: {
        app_id: "53dc8ca7-fd32-49c2-8a23-69d68075f36f",
        contents: { en: title },
        included_segments: ["Subscribed Users"],
        data: {
          uri,
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

module.exports = sendNotification;
