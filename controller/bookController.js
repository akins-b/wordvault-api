const { getAuth } = require("@clerk/express");
const bookService = require("../service/bookService");


async function createBook(req, res){
    try {
        const { userId } = getAuth(req);  
        console.log('userId:', userId);  

        if (!userId) return res.status(401).json({ message: 'no user id so Unauthorized' });

        const book = await bookService.createBook({
            ...req.body,
            userId,
        });
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

async function getAllBooks(req, res){
    try {
        const books = await bookService.getAllBooks();
        res.json(books);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

async function getBookById(req, res){
    try {
        const book = await bookService.getBookById({
            id: req.params.id,
            userId: req.auth.userId,
        });
        res.json(book);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

async function updateBook(req, res){
    try {
        const book = await bookService.updateBook({
            ...req.body,
            id: req.params.id,
            userId: req.auth.userId,
        });
        res.json(book);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

async function deleteBook(req, res){
    try {
        const message = await bookService.deleteBook({
            id: req.params.id,
            userId: req.auth.userId,
        });
        res.status(200).json({message: message});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
}