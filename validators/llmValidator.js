const zod  = require("zod");

const requestSchema = zod.object({
    text: zod.string()
});

const responseSchemaWithExample = zod.object({
  definition: zod.string(),
  example: zod.string(),
  synonyms: zod.array(zod.string()),
  antonyms: zod.array(zod.string()),
});

const responseSchemaWithoutExample = zod.object({
  definition: zod.string(),
  example: zod.null(),
  synonyms: zod.array(zod.string()),
  antonyms: zod.array(zod.string()),
});

module.exports = {
    requestSchema,
    responseSchemaWithExample,
    responseSchemaWithoutExample
};