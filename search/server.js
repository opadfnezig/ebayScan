const { Kafka } = require('kafkajs');
const { taskLogger } = require('./logger/main.js')();
let ChatGPTAPI;

const kafka = new Kafka({
    clientId: `search.${process.env.NAME}`,
    brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: `search.${process.env.NAME}` });
const producer = kafka.producer();

(async () => {
    ChatGPTAPI = await require('./chatGPTAPI')();
    await consumer.connect();
    await consumer.subscribe({ topic: `listener.${process.env.LISTENER_NAME}` });

    await producer.connect();

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message && message.value) {
                const systemMessage = `
                Evaluate the product based on the following client's requirements:
                ${process.env.REQUIREMENTS}.
                Respond with a single integer score between 0 and 100. 
                Only the integer is allowed. Do not include any additional text, explanation, or formatting.
            
                Examples:
                - If the product fully meets the requirements, respond with: 100.
                - If the product partially meets the requirements, respond with a score like: 70, 50, or 30.
                - If the product does not meet the requirements, respond with: 0.
            
                Be objective and critical in your evaluation.`;
                const value = message.value.toString();
                const response = await ChatGPTAPI.sendMessage(JSON.stringify(value), {
                    systemMessage
                });
                taskLogger.debug('message: {msg} response: {response} systemMessage: {sytemMessage}',
                    { msg: value, response: JSON.stringify(response), systemMessage });
                const score = response.detail.choices[0].message.content;
                const newMessage = JSON.parse(value);
                newMessage.score = score;
                taskLogger.debug(score);
                await producer.send({
                    topic: `search.${process.env.NAME}`,
                    messages: [
                        { value: JSON.stringify({ ...newMessage, searchId: process.env.SEARCH_ID }) },
                    ],
                });
            }
        }
    });

    setInterval(() => { }, 1000);
})()