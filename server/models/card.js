const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    position: {
      type: Number,
      required: true,
    },
    image: {
      type: String, // URL or file path to the uploaded image
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
