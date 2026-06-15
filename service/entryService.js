const prisma = require("../db");
const { generate } = require("../utils/llm");

async function createEntry(data){
    try {
        const {text, bookId, userId, wantsExample} = data;
        const existingEntry = await prisma.entry.findUnique({
            where: { userId_text: { userId, text } }
        });
        if(existingEntry){
            throw new Error("Entry already exists");
        }

        if(bookId){
            const book = await prisma.book.findUnique({
                where: {id: bookId}
            });
            if(!book){
                throw new Error("Book not found");
            }
        }

        const { definition, example, synonyms, antonyms } = await generate({ text, wantsExample });

        console.log("Definition: ", definition);
        console.log("Example: ", example);
        console.log("Synonyms: ", synonyms);
        console.log("Antonyms: ", antonyms);

        const entry = await prisma.entry.create({
            data: {
                text,
                definition,
                example : example || null,
                synonyms,
                antonyms,
                bookId : bookId || null,
                userId
            }
        });
        return entry;
    } catch(error){
        throw error;
    }
}

async function lookupEntry({ text, wantsExample }) {
    try {
        const { definition, example, synonyms, antonyms } = await generate({ text, wantsExample });
        return { text, definition, example, synonyms, antonyms };
    } catch (error) {
        throw error;
    }
}

async function getAllEntries(userId){
    try {
        const entries = await prisma.entry.findMany({
            where: { userId }
        });
        return entries;
    } catch(error){
        throw error;
    }
}

async function getEntryById(id, userId){
    try {
        const entry = await prisma.entry.findUnique({
            where: { id, userId }
        });
        if(!entry){
            throw new Error("Entry not found");
        }
        return entry;
    } catch(error){
        throw error;
    }
}

async function updateEntry(id, userId, data) {
    const { ...fields } = data;
    const existing = await prisma.entry.findUnique({ where: { id, userId } });
    if (!existing) throw new Error('Entry not found');

    const fieldsToUpdate = Object.fromEntries(
        Object.entries(fields).filter(([_, value]) => value !== undefined)
    );

    return await prisma.entry.update({
        where: { id },
        data: fieldsToUpdate
    });
}

async function deleteEntry(data){
    try {
        const { id, userId } = data;
        const entry = await prisma.entry.findUnique({
            where: { id, userId }
        });
        if(!entry){
            throw new Error("Entry not found");
        }
        await prisma.entry.delete({
            where: { id }
        });
        return {message: "Entry deleted successfully"};
    } catch(error){
        throw error;
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