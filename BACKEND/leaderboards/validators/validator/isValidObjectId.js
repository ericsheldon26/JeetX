const Joi = require("joi");
const mongoose = require("mongoose");

module.exports = (key) =>
  Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": `Invalid ${key} Object Id`,
    });
