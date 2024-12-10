require('./endpoints');
const { taskLogger } = require('./logger/main.js')();
const database = require('./database/main.js');
const { Listener, Search } = require('./database/schema');
const docker_controller = require('./docker_controller');

(async () => {
    //restore state
    Listener.find({ enabled: true }).then(async listeners => {
        for (const listener of listeners) {
            await docker_controller.enable_listener(listener.name, [
                `CHECK_INTERVAL=${listener.checkInterval}`,
                `PRODUCTS_TO_SEND=${10}`,
                `PRODUCT_PARAMS=${JSON.stringify(listener.productParams)}`,
                `LISTENER_ID=${listener._id}`,
                `URL=${listener.url}`
            ]);
        }
    });

    Search.find().then(async searches => {
        for (const search of searches) {
            await docker_controller.enable_search(search.name, [
                `LISTENER_NAME=${search.listenerName}`,
                `SEARCH_ID=${search._id}`,
                `REQUIREMENTS=${search.requirements}`
            ]);
        }
    });
})();