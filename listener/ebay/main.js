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
    const response = await ChatGPTAPI.sendMessage(JSON.stringify(product), {
        systemMessage: `
        You will receive raw product data in JSON format. Your task is to process it as follows:
    - Extract the "product_params" from the input.
    - Format the response as JSON in the following structure:
        [
            {"${JSON.parse(process.env.PRODUCT_PARAMS).join('\", \"')}"}
        ]
    - If the input contains multiple products, add them as separate elements in the array. 
      For example:
      [
            {"${JSON.parse(process.env.PRODUCT_PARAMS).join('\", \"')}"}
            {"${JSON.parse(process.env.PRODUCT_PARAMS).join('\", \"')}"}
      ]
    - Return only the JSON response. Do not copy the input exactly.
    - Data in () is just for you. don't include it in responce.
`});
    product.description = JSON.parse(response.detail.choices[0].message.content);
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