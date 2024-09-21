// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var service_pb = require('./service_pb.js');

function serialize_service_StartRequest(arg) {
  if (!(arg instanceof service_pb.StartRequest)) {
    throw new Error('Expected argument of type service.StartRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_service_StartRequest(buffer_arg) {
  return service_pb.StartRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_service_StartResponse(arg) {
  if (!(arg instanceof service_pb.StartResponse)) {
    throw new Error('Expected argument of type service.StartResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_service_StartResponse(buffer_arg) {
  return service_pb.StartResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_service_StateRequest(arg) {
  if (!(arg instanceof service_pb.StateRequest)) {
    throw new Error('Expected argument of type service.StateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_service_StateRequest(buffer_arg) {
  return service_pb.StateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_service_StateResponse(arg) {
  if (!(arg instanceof service_pb.StateResponse)) {
    throw new Error('Expected argument of type service.StateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_service_StateResponse(buffer_arg) {
  return service_pb.StateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_service_StopRequest(arg) {
  if (!(arg instanceof service_pb.StopRequest)) {
    throw new Error('Expected argument of type service.StopRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_service_StopRequest(buffer_arg) {
  return service_pb.StopRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_service_StopResponse(arg) {
  if (!(arg instanceof service_pb.StopResponse)) {
    throw new Error('Expected argument of type service.StopResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_service_StopResponse(buffer_arg) {
  return service_pb.StopResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ServiceManagerService = exports.ServiceManagerService = {
  start: {
    path: '/service.ServiceManager/Start',
    requestStream: false,
    responseStream: false,
    requestType: service_pb.StartRequest,
    responseType: service_pb.StartResponse,
    requestSerialize: serialize_service_StartRequest,
    requestDeserialize: deserialize_service_StartRequest,
    responseSerialize: serialize_service_StartResponse,
    responseDeserialize: deserialize_service_StartResponse,
  },
  stop: {
    path: '/service.ServiceManager/Stop',
    requestStream: false,
    responseStream: false,
    requestType: service_pb.StopRequest,
    responseType: service_pb.StopResponse,
    requestSerialize: serialize_service_StopRequest,
    requestDeserialize: deserialize_service_StopRequest,
    responseSerialize: serialize_service_StopResponse,
    responseDeserialize: deserialize_service_StopResponse,
  },
  state: {
    path: '/service.ServiceManager/State',
    requestStream: false,
    responseStream: false,
    requestType: service_pb.StateRequest,
    responseType: service_pb.StateResponse,
    requestSerialize: serialize_service_StateRequest,
    requestDeserialize: deserialize_service_StateRequest,
    responseSerialize: serialize_service_StateResponse,
    responseDeserialize: deserialize_service_StateResponse,
  },
};

exports.ServiceManagerClient = grpc.makeGenericClientConstructor(ServiceManagerService);
