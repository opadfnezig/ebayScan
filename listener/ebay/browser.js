const puppeteer = require('puppeteer');

let browser, listPage;

async function open(url) {
    browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage'
        ]
    });

    listPage = await browser.browser.newPage();
    await listPage.goto(url);
}

async function changeLanguage() {
    await page.waitForSelector('#gh-ug');
    await page.$eval('li#gh-eb-Geo', el => el.click());
    await page.waitForSelector(`[lang='en-US']`);
    await page.$eval(`[lang='en-US']`, el => el.click());
}

async function updateListPage() {
    listPage.reload();
    await page.waitForSelector('.s-item.s-item__dsa-on-bottom.s-item__pl-on-bottom');
    return listPage;
}

async function getProductPage(url) {
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

module.exports = {
    browser,
    listPage,
    open,
    changeLanguage,
    updateListPage,
    getProductPage
}