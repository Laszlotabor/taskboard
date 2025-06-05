const mongoose = require("mongoose");

const authMiddleware = require("../middleware/authMiddleware");


const boardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);


module.exports = mongoose.model("board", boardSchema);
