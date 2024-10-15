const pageParser = require('./parsers/pageParser');
const productParser = require('./parsers/productParser');

const browser = require('./browser');
const ChatGPTAPI = require('../chatGPTAPI')();

async function open(url) {
    await browser.open(url);
    console.log('browser started');
    do {
        console.log('language change started');
        changeLanguage();
        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.listPage.reload();
    } while (await pageParser.parseSignInText(page) != 'Hi! Sign in or register');
}

async function getProductList() {
    await browser.updateListPage();
    return pageParser.parseProductList(browser.listPage);
}

async function processProduct(product) {
    productParser.parsePrice(product);
    const productPage = await browser.getProductPage(product.link);
    product.descriptionUnprocessed = await pageParser.parseDescription(product, productPage);
    await productPage.close();
    product.description = await ChatGPTAPI.sendMessage(JSON.stringify(product), {
        systemMessage: `you should work on this product's description: ${product},
            I expect you to provide better product description in json format. Always use array for product, doesn't matter if it's one or multiple.
            something like {[{title: 'product1', product_params: ${process.env.PRODUCT_PARAMS} description: 'description1'}...]}. Just json response is expected.`
    });
    return product;
}

async function close() {
    await browser.close();
}

module.exports = {
    open,
    getProductList,
    processProduct,
    close
}