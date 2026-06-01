const zod = require("zod");

const createBookSchema = zod.object({
    title: zod.string().min(1, 'Title is required'),
    author: zod.string().optional()
});

const updateBookSchema = zod.object({
    title: zod.string().optional(),
    author: zod.string().optional()
});


module.exports = {
    createBookSchema,
    updateBookSchema,
};