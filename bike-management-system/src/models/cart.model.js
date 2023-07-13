const mongoose = require("mongoose");
const toJSON = require("../plugins/toJSON");

const bikeCartSchema = mongoose.Schema({
  bike: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Bike",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    bike: {
      type: [bikeCartSchema],
      default: [],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts toJSON.js to json
cartSchema.plugin(toJSON);

const BikeCart = mongoose.model("BikeCarts", bikeCartSchema);
const Cart = mongoose.model("Carts", cartSchema);

module.exports = Cart;
