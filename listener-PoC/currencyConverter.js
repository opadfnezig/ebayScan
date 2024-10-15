const axios = require('axios');

async function convertCurrency(fromCurrency, toCurrency, amount) {
    const url = `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
    try {
        const response = await axios.get(url);
        const conversionResult = response.data.result;

        console.log(`${amount} ${fromCurrency} = ${conversionResult} ${toCurrency}`);
        return conversionResult;
    } catch (error) {
        console.error('Error fetching conversion data:', error);
        throw error;
    }
}

module.exports = { convertCurrency };