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
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        canDeleteLists: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);


module.exports = mongoose.model("board", boardSchema);
