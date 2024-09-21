const grpc = require('@grpc/grpc-js');
const serviceProto = require('./generated/service_grpc_pb');
const messages = require('./generated/service_pb');

(async () => {
    const server = new grpc.Server();
    server.addService(serviceProto.ServiceManagerService, {
        start: start,
        stop: stop,
        state: state
    });
    const port = '0.0.0.0:50051';
    server.bindAsync(port, grpc.ServerCredentials.createInsecure(), () => {
        console.log(`Server running at ${port}`);
        server.start();
    });
})();

function start(call, callback) {
    console.log("Start called");
    const response = new messages.StartResponse();
    response.setMessage('Service started');
    callback(null, response);
}

function stop(call, callback) {
    console.log("Stop called");
    const response = new messages.StopResponse();
    response.setMessage('Service stopped');
    callback(null, response);
}

function state(call, callback) {
    console.log("State called");
    const response = new messages.StateResponse();
    response.setMessage('Service is running');
    callback(null, response);
}