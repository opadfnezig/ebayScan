const { Kafka } = require('kafkajs');
const { taskLogger } = require('./logger/main.js')();
const database = require('./database/main.js');
const { ListenResult, SearchResult } = require('./database/schema');

const kafka = new Kafka({
    clientId: 'dbwriter',
    brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'dbwriter' });

async function startConsumer() {
    await consumer.connect();

    await consumer.subscribe({ topic: /.+/, fromBeginning: true });

    try {
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (message && message.value) {
                    const value = message.value.toString();
                    if (topic.startsWith('listener.')) {
                        try {
                            const data = JSON.parse(value);
                            const listenResult = new ListenResult({
                                listenerName: topic.split('.')[1],
                                data: value,
                                url: data.link,
                                params: data.description
                            });
                            await listenResult.save();
                        } catch { }
                    } else if (topic.startsWith('search.')) {
                        try {
                            const data = JSON.parse(value);
                            const searchResult = new SearchResult({
                                searchName: topic.split('.')[1],
                                data: value,
                                url: data.link,
                                score: data.score
                            });
                            await searchResult.save();
                        } catch { }
                    }
                }
            },
        });
    } catch { }
}

(async () => {
    try {
        await startConsumer();
        setInterval(() => { }, 1000);
    } catch { }
})();
