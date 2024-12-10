module.exports = () => {
    const { getLogger } = require(`./logger`);
    const taskLogger = getLogger();
    return {
        taskLogger,
    }
}