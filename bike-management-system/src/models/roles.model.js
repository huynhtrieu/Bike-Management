const mongoose = require("mongoose");
const toJSON = require("../plugins/toJSON");

const roleSchema = mongoose.Schema(
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
roleSchema.plugin(toJSON);

const role = mongoose.model("Role", roleSchema);

module.exports = role;
