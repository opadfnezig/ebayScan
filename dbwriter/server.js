const { Kafka } = require('kafkajs');
const { taskLogger } = require('./logger/main.js')();
const database = require('./database/main.js');
const { ListenResult, SearchResult } = require('./database/schema');

const kafka = new Kafka({
    clientId: 'dbwriter',
    brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'my-group' });

async function startConsumer() {
    await consumer.connect();
    
    await consumer.subscribe({ topic: /.+/, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value.toString();
            if (topic.startsWith('listener.')) {
                await ListenResult.create({ message: value });
                taskLogger.info(`Message saved to listener table: ${value}`);
            } else if (topic.startsWith('search.')) {
                await SearchResult.create({ message: value });
                taskLogger.info(`Message saved to search table: ${value}`);
            } else {
                taskLogger.warn(`Message from unhandled topic ${topic}: ${value}`);
            }
        },
    });
}

startConsumer().catch(console.error);
