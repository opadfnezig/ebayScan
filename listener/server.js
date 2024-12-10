const { taskLogger } = require('./logger/main')();

const { Kafka } = require('kafkajs');
const ebay = require('./ebay/main');

const event = require('events');
const emitter = new event();

const processedLinks = new Set();

const kafka = new Kafka({
    clientId: `listener.${process.env.NAME}`,
    brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

(async () => {
    await producer.connect();
    taskLogger.debug(`producer connected ${process.env.NAME}`);
    await ebay.open(process.env.URL);
    await start();
})();

async function sendMessage(message) {
    await producer.send({
        topic: `listener.${process.env.NAME}`,
        messages: [
            { value: JSON.stringify({ ...message, listenerId: process.env.LISTENER_ID }) },
        ],
    });
}

async function start() {
    await checkProducts();
    setTimeout(start, process.env.CHECK_INTERVAL);
}

async function checkProducts() {
    const productList = await ebay.getProductList();
    productList.map(element => element.link = element.link.split('?')[0]);

    for (let i = 0; i < productList.length && i < process.env.PRODUCTS_TO_SEND; ++i) {
        if (processedLinks.has(productList[i].link)) continue;
        const product = await ebay.processProduct(productList[i]);
        emitter.emit('newProduct', product);
        processedLinks.add(productList[i].link);
        if (processedLinks.size > 10000) {
            const firstProcessed = processedLinks.values().next().value;
            processedLinks.delete(firstProcessed);
        }
    }
}

emitter.on('newProduct', async (product) => {
    await sendMessage(product);
});