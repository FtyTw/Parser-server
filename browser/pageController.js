const pageScraper = require('./pageScrapper');
async function scrapeAll(browserInstance,url,config){
    let browser;
    try{
        browser = await browserInstance;
        const scrapper =  pageScraper(url,config)
       return await scrapper.scraper(browser);

    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance,url,config) => scrapeAll(browserInstance,url,config)