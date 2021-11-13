const axios = require("axios");

const sendNotification = async (url) => {
  console.log("sendNotification");
  try {
    const result = await axios({
      method: "post",
      url: "https://onesignal.com/api/v1/notifications",
      data: {
        app_id: "53dc8ca7-fd32-49c2-8a23-69d68075f36f",
        contents: { en: "English Message" },
        included_segments: ["Subscribed Users"],
        data: {
          url,
        },
      },
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Basic ZGEyN2NmZjItODEzYy00MTRlLTgzNjYtN2NmMDRkMjZhMzJi",
      },
    });
    console.log(result);
  } catch (error) {
    console.log("sendNotification", error);
  }
};

module.exports = sendNotification;
