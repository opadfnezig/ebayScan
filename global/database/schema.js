const mongoose = require('mongoose');

const listenerSchema = new mongoose.Schema({
    productsToSend: { type: Number },
    name: { type: String, required: true },
    checkInterval: { type: Number, required: true },
    productParams: { type: Object, required: true },
    enabled: { type: Boolean, default: false },
    url: { type: String, required: true }
});

const Listener = mongoose.model('Listener', listenerSchema);

const searchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    listenerName: { type: String, required: true },
    requirements: { type: String, required: true }
});

const Search = mongoose.model('Search', searchSchema);

const searchResultSchema = new mongoose.Schema({
    searchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Search', required: true },
    score: { type: Number, required: true },
    listenResultId: { type: mongoose.Schema.Types.ObjectId, ref: 'ListenResult', required: true },
    enabled: { type: Boolean, default: false }
});

const SearchResult = mongoose.model('SearchResult', searchResultSchema);

const listenResultSchema = new mongoose.Schema({
    listenerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listener', required: true },
    data: { type: Object, required: true }
});

const ListenResult = mongoose.model('ListenResult', listenResultSchema);

module.exports = {
    Listener,
    Search,
    ListenResult,
    SearchResult
};