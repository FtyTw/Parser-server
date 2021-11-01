const scraperObject = {
    url: 'https://besplatka.ua/odessa/nedvizhimost/prodazha-kvartir/suvorovskii-r-n',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        await page.waitForSelector('.messages-list');
        // Get the link to all the required books
        let urls = await page.$$eval('.d-title', links => {
            // Make sure the book to be scraped is in stock
            // links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
            // Extract the links from the data
            links = links.map(el => {
            	const {href,innerText} = el.querySelector('a')
            	return '' + href + innerText

            })
            return links;
        });
        // console.log(urls);
        return urls
        return
        // Loop through each of those links, open a new page instance and get the relevant data from them
        let pagePromise = (link) => new Promise(async(resolve, reject) => {
            let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link);
            dataObj['bookTitle'] = await newPage.$eval('.product_main > h1', text => text.textContent);
            dataObj['bookPrice'] = await newPage.$eval('.price_color', text => text.textContent);
            dataObj['noAvailable'] = await newPage.$eval('.instock.availability', text => {
                // Strip new line and tab spaces
                text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
                // Get the number of stock available
                let regexp = /^.*\((.*)\).*$/i;
                let stockAvailable = regexp.exec(text)[1].split(' ')[0];
                return stockAvailable;
            });
            dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', img => img.src);
            dataObj['bookDescription'] = await newPage.$eval('#product_description', div => div.nextSibling.nextSibling.textContent);
            dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', table => table.textContent);
            resolve(dataObj);
            await newPage.close();
        });

        for(link in urls){
            let currentPageData = await pagePromise(urls[link]);
            // scrapedData.push(currentPageData);
            console.log(currentPageData);
        }
    }
}

module.exports = scraperObject;