const Joi = require("joi");

const contactAddSchema = Joi.object({
  name: Joi.string()
    .max(40)
    .required()
    .messages({ "any.required": 'Field "name" is missing' }),
  email: Joi.string()
    .email()
    .required()
    .messages({ "any.required": 'Field "email" is missing' }),
  phone: Joi.string()
    .max(15)
    .required()
    .messages({ "any.required": 'Field "phone" is missing' }),
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": 'Field "favorite" is missing' }),
});

const updateFavoriteSchema = Joi.object(
  {
    favorite: Joi.boolean().messages({
      "any.required": 'Field "favorite" is missing',
    }),
  },
  { abortEarly: false }
);

module.exports = { contactAddSchema, updateFavoriteSchema };
