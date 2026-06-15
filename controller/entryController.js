const entryService = require("../service/entryService");

async function createEntry(req, res){
    try {
        const {text, bookId, wantsExample} = req.body;
        const entry = await entryService.createEntry({text, bookId, userId: req.headers['x-user-id'], wantsExample});
        res.status(201).json(entry);
    } catch(error){
        res.status(500).json({message: error.message});
    }

}

async function lookupEntry(req, res) {
  try {
    const { text, wantsExample } = req.body;
    const result = await entryService.lookupEntry({ text, wantsExample });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllEntries(req, res){
    try {
        const entries = await entryService.getAllEntries(req.headers['x-user-id']);
        res.json(entries);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

async function getEntryById(req, res){
    try {
        const entry = await entryService.getEntryById(req.params.id, req.headers['x-user-id']);
        res.json(entry);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

async function updateEntry(req, res){
    try {
        const entry = await entryService.updateEntry(req.params.id, req.headers['x-user-id'], req.body);
        res.json(entry);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

async function deleteEntry(req, res){
    try {
        const message = await entryService.deleteEntry({ id: req.params.id, userId: req.headers['x-user-id'] });
        res.json(message);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    createEntry,
    lookupEntry,
    getAllEntries,
    getEntryById,
    updateEntry,
    deleteEntry
}