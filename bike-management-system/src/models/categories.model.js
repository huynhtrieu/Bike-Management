const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const toJSON = require("../plugins/toJSON");

const bikeCategoriesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts toJSON.js to json
bikeCategoriesSchema.plugin(toJSON);

const bikeCategories = mongoose.model("Categories", bikeCategoriesSchema);

module.exports = bikeCategories;
