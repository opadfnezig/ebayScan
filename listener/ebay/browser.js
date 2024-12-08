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

    listPage = await browser.newPage();
    await listPage.goto(url);
}

async function changeLanguage() {
    await listPage.waitForSelector('#gh-ug');
    await listPage.$eval('li#gh-eb-Geo', el => el.click());
    await listPage.waitForSelector(`[lang='en-US']`);
    await listPage.$eval(`[lang='en-US']`, el => el.click());
}

async function updateListPage() {
    await listPage.reload();
    await listPage.waitForSelector('.s-item.s-item__dsa-on-bottom.s-item__pl-on-bottom');
    return listPage;
}

async function getProductPage(url) {
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

function getListPage() { return listPage; }
function getBrowser() { return browser; }

module.exports = {
    open,
    changeLanguage,
    updateListPage,
    getProductPage,
    getListPage,
    getBrowser
}