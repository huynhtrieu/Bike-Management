const mongoose = require("mongoose");
const toJSON = require("../plugins/toJSON");

const bikeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    quantity: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
    bikeCategory: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Categories",
      required: true,
    },
    information: {
      overallInformation: {
        warranty: {
          type: String,
          default: "",
        },
        origin: {
          type: String,
          default: "",
        },
        author: {
          type: String,
          default: "",
        },
      },
      body: {
        height: {
          type: String,
          default: "",
        },
        length: {
          type: String,
          default: "",
        },
        width: {
          type: String,
          default: "",
        },
        weight: {
          type: String,
          default: "",
        },
      },
      feature: {
        engine: {
          type: String,
          default: "",
        },
        wattage: {
          type: String,
          default: "",
        },
        speed: {
          type: String,
          default: "",
        },
        heavyCapacity: {
          type: String,
          default: "",
        },
      },
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts toJSON.js to json
bikeSchema.plugin(toJSON);

/**
 * @typedef bike
 */
const bike = mongoose.model("Bike", bikeSchema);

module.exports = bike;
