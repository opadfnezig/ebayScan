const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { convertCurrency } = require('./currencyConverter');

const url = 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313&_nkw=&_sacat=56083&_fsrp=1&_odkw=&_osacat=56083&_sop=10&_ipg=240';
//let products = [];

const description = `
    some kind of sata hard drives. ideally in bundles (multiple avaliable or just a bunch of drives in one lot), price per gb should be less than 5 CZK (prices are in CZK);
    condition doesn't matter, but I think used is better, unknown condition is OK, but not refurbished;
    If it's not sata just give score of 0;
`;
let api;
(async () => {
    const { ChatGPTAPI } = await import('chatgpt');
    api = new ChatGPTAPI(
        {
            apiKey: process.env.OPENAI_API_KEY,
            completitionParams: {
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                max_tokens: 150,
                top_p: 0.8,
            }
        });


    try {
        console.log('starting browser...');
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage'
            ]
        });
        console.log('browser started');

        const page = await browser.newPage();
        await page.goto(url);

        do {
            console.log('language change started');
            await page.waitForSelector('#gh-ug');
            await page.$eval('li#gh-eb-Geo', el => el.click());
            await page.waitForSelector(`[lang='en-US']`);
            await page.$eval(`[lang='en-US']`, el => el.click());
            await new Promise(resolve => setTimeout(resolve, 5000));
            await page.reload();
            await page.waitForSelector('#gh-ug');
        } while (await page.$eval('#gh-ug', el => el.innerText) != 'Hi! Sign in or register');

        await page.waitForSelector('.s-item.s-item__dsa-on-bottom.s-item__pl-on-bottom');
        const products = await page.$$eval('.s-item.s-item__dsa-on-bottom.s-item__pl-on-bottom', items => {
            return items.map(item => {
                let title = item.querySelector('.s-item__title')?.innerText;
                const link = item.querySelector('.s-item__link')?.href;
                if (title)
                    title = title.replace(/^NEW LISTING\s*/, '');
                return {
                    link: link,
                    title: title,
                    listingDate: item.querySelector('.s-item__listingDate')?.innerText,
                    priceString: item.querySelector('.s-item__price')?.innerText,
                    subtitle: item.querySelector('.s-item__subtitle')?.innerText,
                };
            });
        });

        for (let product of products) {
            console.log(product);
            const priceSplit = product.priceString.split(' ');
            const currency = priceSplit[priceSplit.length - 1];
            const parsedPrice = product.priceString.replace(` ${currency}`, '').replace(',', '');
            product.price = await convertCurrency(currency, 'EUR', parsedPrice);
            product.descriptionUnprocessed = await getProductDescription(browser, product.link);
            product.description = await processDescription(product, 'interface, capacity, condition, speed, cache, form factor, model, brand');
            console.log(product);
            //product.score = await evaluateProduct(product);
            //console.log(product);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    } catch (error) {
        console.error('error starting Puppeteer', error);
    }
})();

async function evaluateProduct(product) {
    try {
        const response = await api.sendMessage(JSON.stringify(product), {
            systemMessage: `
            You should evaluate how much this product fits the description provided.
            description: ${description}`
        });
        return response.data;
    } catch (error) {
        console.error("requestError:", error);
    }
}

async function getProductDescription(browser, url) {
    try {
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('.vim.x-evo-tabs-region .tabs__content');
        const res = await page.$eval('.vim.x-evo-tabs-region .tabs__content', el => el.innerText);
        await page.close();
        return res;
    } catch (error) {
        console.error("requestError:", error);
    }
}

async function processDescription(product, characteristics) {
    try {
        const response = await api.sendMessage(JSON.stringify(product), {
            systemMessage: `you should work on this product's description: ${product},
            I expect you to provide better product description in json format. If there are multiple products, provide them in an array.
            something like {[title: 'product1', characteristics: ${characteristics} description: 'description1']...}. Just json response is expected.`
        });
        return response.data;
    } catch (error) {
        console.error("requestError:", error);
    }
}