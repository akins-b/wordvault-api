const zod = require("zod");

const createEntrySchema = zod.object({
    text: zod.string().min(1, "Text is required"),
    bookId: zod.string().optional(),
    wantsExample: zod.boolean().default(false),
})

const updateEntrySchema = zod.object({
    mastered: zod.boolean().optional(),
    bookId: zod.string().optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided' }
);



module.exports = {
    createEntrySchema,
    updateEntrySchema
}