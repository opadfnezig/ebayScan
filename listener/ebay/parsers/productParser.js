
function parsePrice(product) {
    const priceSplit = product.priceString.split(' ');
    const currency = priceSplit[priceSplit.length - 1];
    product.parsedPrice = product.priceString.replace(` ${currency}`, '').replace(',', '');
}

module.exports = {
    parsePrice
}