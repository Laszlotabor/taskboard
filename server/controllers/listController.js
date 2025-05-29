const List = require("../models/list");

// @desc    Get all lists for a board
// @route   GET /api/lists/:boardId
// @access  Private
exports.getLists = async (req, res) => {
  try {
    const lists = await List.find({ board: req.params.boardId }).sort(
      "position"
    );
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new list in a board
// @route   POST /api/lists
// @access  Private
exports.createList = async (req, res) => {
  const { board, title, position } = req.body;
  if (!board || !title || position === undefined) {
    return res
      .status(400)
      .json({ message: "Board, title, and position are required" });
  }

  try {
    const newList = new List({ board, title, position });
    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a list
// @route   PUT /api/lists/:id
// @access  Private
exports.updateList = async (req, res) => {
  const { title, position } = req.body;

  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: "List not found" });

    list.title = title ?? list.title;
    list.position = position ?? list.position;

    const updatedList = await list.save();
    res.json(updatedList);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a list
// @route   DELETE /api/lists/:id
// @access  Private
exports.deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: "List not found" });

    await List.deleteOne({ _id: list._id });
    res.json({ message: "List removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
