const Board = require("../models/board");

const boardPermission = async (req, res, next) => {
  try {
    const boardId = req.params.id; // matches your route param name
    const userId = req.user._id;

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const isOwner = board.user.equals(userId);
    const isMember = board.members.some((member) => member.user.equals(userId));

    if (!isOwner && !isMember) {
      return res
        .status(403)
        .json({ message: "Permission denied: cannot modify this board" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error checking permissions" });
  }
};

module.exports = boardPermission;
