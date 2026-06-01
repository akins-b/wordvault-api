const prisma = require("../db");

async function createBook(book){
    try {
        const newBook = await prisma.book.create({
            data: book
        });
        return newBook;
    } catch (error){
        throw error;
    }
}

async function getAllBooks(){
    try {
        const books = await prisma.book.findMany({
            include: {
                user: true
            }
        });
        return books;
    } catch (error){
        throw error;
    }
}

async function getBookById(data){
    try {
        const book = await prisma.book.findUnique({
            where: {
                id: data.id,
                userId: data.userId,
            }
        });

        if(!book){
            throw new Error("No book was found");
        }
        return book;
    } catch(error){
        throw error;
    }
}

async function updateBook(data){
    const { id, userId, ...fields } = data;
    try {
        const existingBook = await prisma.book.findUnique({
            where: {
                id,
                userId
            }
        });

        if(!existingBook){
            throw new Error("No book was found");
        }

        const updatedFields = Object.fromEntries(
            Object.entries(fields).filter(([_, value]) => value !== undefined)
        );

        const updatedBook = await prisma.book.update({
            where: { id: existingBook.id, userId: existingBook.userId },
            data: updatedFields
        });
        return updatedBook;
    } catch (error){
        throw error;
    }
}

async function deleteBook(data){
    try {
        const existingBook = await prisma.book.findUnique({
            where: {
                id: data.id,
                userId: data.userId
            }
        });

        if(!existingBook){
            throw new Error("No book was found");
        }

        await prisma.book.delete({
            where: {
                id: existingBook.id,
                userId: existingBook.userId
            }
        });
        return {message: "Book deleted successfully"};
    } catch(error){
        throw error;
    }
}

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
}