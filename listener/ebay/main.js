const pageParser = require('./parsers/pageParser');
const productParser = require('./parsers/productParser');
const { taskLogger } = require('../logger/main.js')();

const browser = require('./browser');
let ChatGPTAPI;

async function open(url) {
    await browser.open(url);
    do {
        taskLogger.debug('language change started');
        await browser.changeLanguage();
        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.getListPage().reload();
    } while (await pageParser.parseSignInText(browser.getListPage()) != 'Hi! Sign in or register');
    taskLogger.debug('language change finished');
}

async function getProductList() {
    await browser.updateListPage();
    return pageParser.parseProductList(browser.getListPage());
}

async function processProduct(product) {
    await initApi();
    productParser.parsePrice(product);
    const productPage = await browser.getProductPage(product.link);
    product.descriptionUnprocessed = await pageParser.parseDescription(productPage);
    await productPage.close();
    product.description = (await ChatGPTAPI.sendMessage(JSON.stringify(product), {
        systemMessage: `you should work on this product's description: ${product},
            I expect you to provide better product description in json format. Always use array for product, doesn't matter if it's one or multiple.
            something like {[{title: 'product1', product_params: ${process.env.PRODUCT_PARAMS} description: 'description1'}...]}. Just json response is expected.`
    })).data;
    return product;
}

async function close() {
    await browser.close();
}

async function initApi() {
    if (!ChatGPTAPI)
        ChatGPTAPI = await require('../chatGPTAPI')();
}

module.exports = {
    open,
    getProductList,
    processProduct,
    close
}