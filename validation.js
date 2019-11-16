const Joi = require("@hapi/joi");

module.exports = schema = Joi.object().keys({
  name: Joi.string()
    .alphanum()
    .required(),
  email: Joi.string()
    .email()
    .required(),
  message: Joi.string().required()
});
