const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "board",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true, // to manage list ordering
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("list", listSchema);
