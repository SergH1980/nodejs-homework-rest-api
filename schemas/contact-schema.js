const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().max(40).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(15).required(),
});

module.exports = contactSchema;
