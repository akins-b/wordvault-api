const entryService = require("../service/entryService");
const { getAuth } = require("@clerk/express");

async function createEntry(req, res){
    try {
        const {text, bookId, wantsExample} = req.body;
        const entry = await entryService.createEntry({text, bookId, userId: getAuth(req).userId, wantsExample});
        res.status(201).json(entry);
    } catch(error){
        res.status(500).json({message: error.message});
    }

}

async function getAllEntries(req, res){
    try {
        const entries = await entryService.getAllEntries(getAuth(req).userId);
        res.json(entries);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

async function getEntryById(req, res){
    try {
        const entry = await entryService.getEntryById(req.params.id, getAuth(req).userId);
        res.json(entry);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

async function updateEntry(req, res){
    try {
        const entry = await entryService.updateEntry(req.params.id, getAuth(req).userId, req.body);
        res.json(entry);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

async function deleteEntry(req, res){
    try {
        const message = await entryService.deleteEntry({ id: req.params.id, userId: getAuth(req).userId });
        res.json(message);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    createEntry,
    getAllEntries,
    getEntryById,
    updateEntry,
    deleteEntry
}