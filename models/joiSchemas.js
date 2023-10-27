const Joi = require("joi");
const addSchema = Joi.object({
  name: Joi.string().min(2).max(30).required().messages({
    "string.base": "name",
    "string.empty": "name",
    "any.required": "name",
  }),
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "string.base": "email",
    "string.empty": "email",
    "any.required": "email",
  }),
  phone: Joi.string()
    .trim()
    .regex(/^(\(\d{3}\)|\d{3})(-|\s|\.)?\d{3}(-|\s|\.)?\d{4}$/)
    .required()
    .messages({
      "string.base": "phone",
      "string.empty": "phone",
      "string.pattern.base": "phone",
      "any.required": "phone",
    }),
});

const schemaUpdate = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
}).min(1);

module.exports = {
  addSchema,
  schemaUpdate,
};
