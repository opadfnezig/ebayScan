const express = require('express');
const { Listener, Search, SearchResult, ListenResult } = require('./database/schema');
const { taskLogger } = require('./logger/main.js')();
const { enable_listener, disable_listener, enable_search, disable_search } = require('./docker_controller.js');

const app = express();
app.use(express.json());

// Listener CRUD
app.get('/listener/:id', async (req, res) => {
    try {
        const listener = await Listener.findById(req.params.id);
        if (!listener) return res.status(404).json({ error: 'Listener not found' });
        res.status(200).json(listener);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/listener', async (req, res) => {
    try {
        const listener = new Listener(req.body);
        await listener.save();
        res.status(201).json(listener);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/listener/:id', async (req, res) => {
    try {
        const listener = await Listener.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!listener) return res.status(404).json({ error: 'Listener not found' });
        res.status(200).json(listener);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/listener/:id', async (req, res) => {
    try {
        const listener = await Listener.findByIdAndDelete(req.params.id);
        if (!listener) return res.status(404).json({ error: 'Listener not found' });
        res.status(200).json({ message: 'Listener deleted' });
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/listeners', async (req, res) => {
    try {
        const listeners = await Listener.find();
        res.status(200).json(listeners);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/listener/:id/enable', async (req, res) => {
    try {
        const listener = await Listener.findByIdAndUpdate(req.params.id, { enabled: true }, { new: true });
        await enable_listener(listener.name, listener.env);
        if (!listener) return res.status(404).json({ error: 'Listener not found' });
        res.status(200).json({ message: 'Listener enabled', listener });
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/listener/:id/disable', async (req, res) => {
    try {
        const listener = await Listener.findByIdAndUpdate(req.params.id, { enabled: false }, { new: true });
        if (!listener) return res.status(404).json({ error: 'Listener not found' });
        res.status(200).json({ message: 'Listener disabled', listener });
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

// Search CRUD
app.get('/search/:id', async (req, res) => {
    try {
        const search = await Search.findById(req.params.id);
        if (!search) return res.status(404).json({ error: 'Search not found' });
        res.status(200).json(search);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/search', async (req, res) => {
    try {
        const search = new Search(req.body);
        await search.save();
        res.status(201).json(search);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/search/:id', async (req, res) => {
    try {
        const search = await Search.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!search) return res.status(404).json({ error: 'Search not found' });
        res.status(200).json(search);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/search/:id', async (req, res) => {
    try {
        const search = await Search.findByIdAndDelete(req.params.id);
        if (!search) return res.status(404).json({ error: 'Search not found' });
        res.status(200).json({ message: 'Search deleted' });
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/searches', async (req, res) => {
    try {
        const searches = await Search.find();
        res.status(200).json(searches);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

// search_result CRUD
app.get('/search_result/:id', async (req, res) => {
    try {
        const result = await SearchResult.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Result not found' });
        res.status(200).json(result);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/search_result', async (req, res) => {
    try {
        const result = new SearchResult(req.body);
        await result.save();
        res.status(201).json(result);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/search_result/:id', async (req, res) => {
    try {
        const result = await SearchResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) return res.status(404).json({ error: 'Result not found' });
        res.status(200).json(result);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/search_result/:id', async (req, res) => {
    try {
        const result = await SearchResult.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Result not found' });
        res.status(200).json({ message: 'Result deleted' });
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/search_results/:searchId', async (req, res) => {
    try {
        const results = await SearchResult.find({ searchId: req.params.searchId });
        res.status(200).json(results);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

// listen_result CRUD
app.get('/listen_result/:id', async (req, res) => {
    try {
        const result = await SearchResult.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Result not found' });
        res.status(200).json(result);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/listen_result', async (req, res) => {
    try {
        const result = new SearchResult(req.body);
        await result.save();
        res.status(201).json(result);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/listen_result/:id', async (req, res) => {
    try {
        const result = await SearchResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) return res.status(404).json({ error: 'Result not found' });
        res.status(200).json(result);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/listen_result/:id', async (req, res) => {
    try {
        const result = await SearchResult.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Result not found' });
        res.status(200).json({ message: 'Result deleted' });
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/listen_results/:listenerId', async (req, res) => {
    try {
        const results = await SearchResult.find({ searchId: req.params.listenerId });
        res.status(200).json(results);
    } catch (error) {
        taskLogger.error(error.message)
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});