const Board = require("../models/board");
const User = require("../models/user");

// @desc    Get all boards for logged-in user (owner or invited)
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ user: req.user._id }, { members: req.user._id }],
    });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new board
exports.createBoard = async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const newBoard = new Board({
      user: req.user._id,
      title,
      description,
    });

    const savedBoard = await newBoard.save();
    res.status(201).json(savedBoard);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single board by ID (owner or invited)
exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      $or: [{ user: req.user._id }, { members: req.user._id }],
    });

    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a board (owner only)
exports.updateBoard = async (req, res) => {
  const { title, description } = req.body;

  try {
    const board = await Board.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!board) return res.status(404).json({ message: "Board not found" });

    board.title = title || board.title;
    board.description = description || board.description;

    const updatedBoard = await board.save();
    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a board (owner only)
exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!board) return res.status(404).json({ message: "Board not found" });

    await Board.deleteOne({ _id: board._id });
    res.json({ message: "Board removed" });
  } catch (error) {
    console.error("Delete Board Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Invite a user to a board by email (owner only)
// @route   POST /api/boards/:id/invite
exports.inviteUserToBoard = async (req, res) => {
  const { email } = req.body;
  const boardId = req.params.id;

  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    if (!board.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: "User not found" });
    }

    if (board.members.includes(userToInvite._id)) {
      return res.status(400).json({ message: "User already invited" });
    }

    board.members.push(userToInvite._id);
    await board.save();

    res.status(200).json({ message: "User invited successfully" });
  } catch (error) {
    console.error("Invite Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
