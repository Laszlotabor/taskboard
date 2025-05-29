const Board = require("../models/board");

// @desc    Get all boards for logged-in user
// @route   GET /api/boards
// @access  Private
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new board
// @route   POST /api/boards
// @access  Private
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

// @desc    Get a single board by ID
// @route   GET /api/boards/:id
// @access  Private
exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a board
// @route   PUT /api/boards/:id
// @access  Private
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

// @desc    Delete a board
// @route   DELETE /api/boards/:id
// @access  Private
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
  
  
