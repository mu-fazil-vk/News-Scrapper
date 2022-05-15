var Full_News = '_https://chat.whatsapp.com/JMC3p6vSiW5A10CWRw0gvW_';
flag =0;
Heading = '';
Img = '';

const express = require("express");
  const app = express();

function whatsapp() {
	flag = 1;
	const wa = require('@open-wa/wa-automate');

	wa.create({
		sessionId: "NEWS_BOT",
		multiDevice: false, //required to enable multiDevice support
		authTimeout: 120, //wait only 60 seconds to get a connection with the host account device
		blockCrashLogs: true,
		disableSpins: true,
		headless: true,
		hostNotificationLang: 'en_IN',
		logConsole: false,
		popup: true,
		qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
	}).then(client => start(client));

	function start(client) {
		client.onAnyMessage(async message => {
			if (flag == 1) {
				await scrapNews('https://www.manoramaonline.com/');
				await client.sendText('120363041772870155@g.us', Full_News);
				//await client.sendImage('120363041772870155@g.us', Img , 'dog.jpeg','Hello');
				console.log(message.from);
				console.log(Img);
			}
		});
	}
}



async function scrapNews(url) {
	const puppeteer = require('puppeteer');
	while (true){
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(url);

		const [e1] = await page.$x('//*[@id="latestNewsWrapper"]/div[1]/div[1]/div[3]/a/img');
		const src = await e1.getProperty('src');
		const srcTxt = src.toString();
		image = srcTxt.replace('JSHandle:', '');

		const [e2] = await page.$x('//*[@id="latestNewsWrapper"]/div[1]/div[1]/div[2]/a');
		const head = await e2.getProperty('textContent');
		const headTxt = head.toString();
		heading = headTxt.replace('JSHandle:', '').trimEnd();

		const [e3] = await page.$x('//*[@id="latestNewsWrapper"]/div[1]/div[1]/p/a');
		const content = await e3.getProperty('textContent');
		const contentTxt = content.toString();
		short = contentTxt.replace('JSHandle:', '');

		const [e4] = await page.$x('//*[@id="latestNewsWrapper"]/div[1]/div[1]/p/a/@href');
		const link = await e4.getProperty('textContent');
		const linktTxt = link.toString();
		links = linktTxt.replace('JSHandle:', '');

		if (Heading == heading){
			console.log('No new news');
			await sleep(800000);
			continue;
			
		}
		else{
			Heading = heading;
			Img = image;
			FullNews = `*${heading}* \n\n_https://chat.whatsapp.com/JMC3p6vSiW5A10CWRw0gvW_\n\n_${short}_ \n_Read More:_\n_${links}_`
			Full_News = FullNews;
			browser.close();
			break;
		}
	}
}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

whatsapp();

var RateLimit = require('express-rate-limit');
var limiter =  RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 100
});

app.use(limiter);

app.get("/", (req, res) => {
  res.sendFile(
    'server/index.html', { root: '.' }
  );
});

app.use(
  "/public",
  express.static("public"),
  require("serve-index")("public", { icons: true })
);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server listening at Port: ${process.env.PORT || 8080}`);
});
