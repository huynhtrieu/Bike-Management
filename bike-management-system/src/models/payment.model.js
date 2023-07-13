const mongoose = require("mongoose");
const toJSON = require("../plugins/toJSON");

const paymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        bike: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Bike",
          required: true,
        },
        quantity: {
          type: String,
        },
      },
    ],
    amount: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    payStatus: {
      type: String,
    },
    payDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts toJSON.js to json
paymentSchema.plugin(toJSON);

/**
 * @typedef payment
 */
const payment = mongoose.model("payment", paymentSchema);

module.exports = payment;
