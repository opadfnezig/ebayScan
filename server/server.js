require('./endpoints');
const { taskLogger } = require('./logger/main.js')();
const database = require('./database/main.js');
const { Listener, Search } = require('./database/schema');


(async () => {
    //restore state
    Listener.find({ enabled: true }).then(async listeners => {
        for (const listener of listeners) {
            await require('./docker_controller').enable_listener(listener.name, [
                `CHECK_INTERVAL=${listener.checkInterval}`,
                `PRODUCTS_TO_SEND=${listener.productsToSend}`,
                `PRODUCT_PARAMS=${JSON.stringify(listener.productParams)}`,
                `LISTENER_ID=${listener._id}`,
                `URL=${listener.url}`
            ]);
        }
    });

    Search.find({ enabled: true }).then(async searches => {
        for (const search of searches) {
            await require('./docker_controller').enable_search(search.name, [
                `LISTENER_NAME=listener-${search.listenerName}`,
                `SEARCH_ID=${search._id}`,
                `REQUIREMENTS=${search.requirements}`
            ]);
        }
    });
})()