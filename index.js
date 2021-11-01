const express = require('express');
const app = express();
const axios = require('axios')
const browserObject = require('./browser');
const scraperController = require('./pageController');

const browserInstance = browserObject.startBrowser();

const getUrls = async () =>{
	return await scraperController(browserInstance)
	
}



app.use((req,res,next)=>{
	res.setHeader('Access-Control-Allow-Origin', '*');
	next()
})




app.get('/yo',  async (req, res) => {
	try{
		const urls = await getUrls()
		console.log(urls)
	    res.send({ message: JSON.stringify(urls) });
    }
    catch(error){
    	console.log('error',error)
    }
});

app.listen('3333', () => {
    console.log('Application listening on port 3333!');
});