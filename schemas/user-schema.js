const Joi = require("joi");

const regEx = /^[a-zA-Z0-9]{6,40}$/;

const userAddSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .pattern(regEx)
    .required()
    .messages({ "any.required": 'Field "password" is missing' }),
  email: Joi.string()
    .email()
    .required()
    .messages({ "any.required": 'Field "email" is missing' }),
  subscription: Joi.string(),
  token: Joi.string(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "Field 'email' is missing",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Field 'password' is missing",
  }),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .required()
    .messages({
      "any.required": "Field 'subscription' is missing",
    }),
});

module.exports = { userAddSchema, userLoginSchema, updateSubscriptionSchema };
