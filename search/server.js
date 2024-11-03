const { Kafka } = require('kafkajs');
const ChatGPTAPI = require('./chatGPTAPI')();

const kafka = new Kafka({
    clientId: `search.${process.env.NAME}`,
    brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer();
const producer = kafka.producer();

(async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: `listener.${process.env.LISTENER_NAME}` });

    await producer.connect();

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const score = (await ChatGPTAPI.sendMessage(JSON.stringify(message.value), {
                systemMesage: `You should evaluate products from 0 to 100 due to client's requirements.
                                Requirements: ${process.env.REQUIREMENTS}. Just score is expected.`
            })).data;
            const newMessage = JSON.parse(message.value);
            newMessage.score = score;
            await producer.send({
                topic: `search.${process.env.NAME}`,
                messages: [
                    { value: { ...newMessage, searchId: process.env.SEARCH_ID } },
                ],
            });
        }
    });
})()