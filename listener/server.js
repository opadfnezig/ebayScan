const { Kafka } = require('kafkajs');
const ebay = require('./ebay/main');
const Queue = require('queue-fifo');
const eventEmitter = require('events');
const emitter = new eventEmitter();

const queue = new Queue();

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();
(async () => {
    await producer.connect();
    await ebay.open(process.env.URL);
    await start();
})();

async function sendMessage(message) {
    await producer.send({
        topic: `listener.${process.env.NAME}`,
        messages: [
            { value: message },
        ],
    });
}

async function start() {
    setTimeout(async () => {
        await checkProducts();
        start();
    }, process.env.CHECK_INTERVAL);
}

async function checkProducts() {
    const productList = await ebay.getProductList();
    if (queue.size() == 0) {
        for (var i in productList) {
            if (productList.size() - 1 - i < process.env.PRODUCTS_TO_SEND) {
                const product = await ebay.processProduct(productList[i]);
                queue.enqueue(product);
                emitter.emit('newProduct', product);
            } else
                queue.enqueue(productList[i]);
        }
    } else {
        const queueLast = queue[queue.length - 1];
        let insert = false;
        for (var i in productList) {
            if (productList[i].link == queueLast.link)
                insert = true;
            else if (insert) {
                queue.dequeue();
                const product = await ebay.processProduct(productList[i]);
                queue.enqueue(product);
                emitter.emit('newProduct', product);
            }
        }
    }
}

eventEmitter.on('newProduct', async (product) => {
    await sendMessage(JSON.stringify(product));
});
