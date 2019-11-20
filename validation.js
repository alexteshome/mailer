const Joi = require("@hapi/joi");

module.exports = schema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  message: Joi.string().required()
});
