const Docker = require('dockerode');
const docker = new Docker();
const logger = require('./logger/main.js')().taskLogger;

async function enableContainer(image, name, env) {
    try {
        const container = docker.getContainer(name);
        await container.remove({ force: true }).catch(() => { });
        const newContainer = await docker.createContainer({
            Image: image,
            name,
            Env: env,
            HostConfig: {
                RestartPolicy: { Name: 'always' },
                NetworkMode: 'ebayscan_es_network'
            }
        });
        await newContainer.start();
        logger.debug(`Container ${name} enabled and started.`);
    } catch (error) {
        logger.error(`Failed to enable container ${name}: ${error.message}`);
    }
};

async function disableContainer(name) {
    try {
        const container = docker.getContainer(name);
        await container.stop();
        logger.debug(`Container ${name} disabled and stopped.`);
    } catch (error) {
        logger.error(`Failed to disable container ${name}: ${error.message}`);
    }
};

async function enable_listener(name, env) {
    await enableContainer('es-listener', `listener-${name}`, [
        ...env,
        `NAME=${name}`,
        `OPENAI_API_KEY=${process.env.OPENAI_API_KEY}`,
        `KAFKA_BROKER=${process.env.KAFKA_BROKER}`,
        `SEQ_URL=${process.env.SEQ_URL}`
    ]);
};

async function enable_search(name, env) {
    await enableContainer('es-search', `search-${name}`, [
        ...env,
        `NAME=${name}`,
        `OPENAI_API_KEY=${process.env.OPENAI_API_KEY}`,
        `KAFKA_BROKER=${process.env.KAFKA_BROKER}`,
        `SEQ_URL=${process.env.SEQ_URL}`
    ]);
};
async function disable_listener(name) { await disableContainer(`listener-${name}`); };

async function disable_search(name) { await disableContainer(`search-${name}`); };

module.exports = {
    enable_listener,
    disable_listener,
    enable_search,
    disable_search
};
