# Parser-app for server

App for parsing of specific realty pages.

Parsing splitted with two methods:

`a) using Puppeter https://pptr.dev/`

`b) using API of the realty page if it's available`

Working in collaboration with `React-Native` application,

that allows to obtain push notification on every new announcement,

and `OneSignal` push notifications solution.

## Install dependencies

After cloning the project run :

`npm install`

For proper work from the server side `chromium` should be installed.

As process manager used `pm2` manager that has to be globally installed by command
`npm i pm2 -g`

## OneSignal

app_id and token has to be added to utils folder within constants.js file

and exported in standard way

in case if file not exist you should create it with corresponding content

fx.

`const onesignal_app_id = "YOUR-ONESIGNAL-APP-ID";`

`const onesignal_token = "YOUR-PROJECT-REST-API-KEY";`

`module.exports = { onesignal_app_id, onesignal_token };`

both values can be found at https://app.onesignal.com/apps/${YOUR-ONESIGNAL-APP-ID}/settings/keys_and_ids page

## DOMRIA

DOMRIA token must be set within constants.js file in the same way as onesignal values fx.

`const domria_key = "YOUR-DOMRIA-API-KEY";`

`module.exports = { onesignal_app_id, onesignal_token, domria_key };`

value can be found at https://api.ria.com/account/api

documentation https://github.com/ria-com/auto-ria-rest-api/tree/master/DOM_RIA_API

## Develop mode

To run server with develop mode:

`npm run dev`

don't forget that in some cases you have to comment

`executablePath: "/usr/bin/chromium-browser"`

within `browser/browser.js` for proper puppeeter work

it's dependent on OS.

To obtain new push notifications on the mobile application,

mobile device has to be added to "Test" group from OneSignal side.

## Production mode

To run server with production mode:
`npm run prod`
