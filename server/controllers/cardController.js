const Card = require("../models/card");

// @desc    Get all cards in a list
// @route   GET /api/cards/:listId
// @access  Private
exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({ list: req.params.listId }).sort("position");
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new card in a list
// @route   POST /api/cards
// @access  Private
exports.createCard = async (req, res) => {
  const { list, title, description, position } = req.body;
  if (!list || !title || position === undefined) {
    return res
      .status(400)
      .json({ message: "List, title, and position are required" });
  }

  try {
    const image = req.file ? req.file.path : null; // multer adds file info to req.file

    const newCard = new Card({ list, title, description, position, image });
    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Update a card
// @route   PUT /api/cards/:id
// @access  Private
exports.updateCard = async (req, res) => {
  const { title, description, position, list } = req.body;

  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    card.title = title ?? card.title;
    card.description = description ?? card.description;
    card.position = position ?? card.position;
    card.list = list ?? card.list;

    if (req.file) {
      card.image = req.file.path; // update image if new file uploaded
    }

    const updatedCard = await card.save();
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Delete a card
// @route   DELETE /api/cards/:id
// @access  Private
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    await Card.deleteOne({ _id: card._id });
    res.json({ message: "Card removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.moveCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { newListId, newPosition } = req.body;

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const oldListId = card.list.toString();

    if (oldListId === newListId) {
      // Move within same list: just update position for now
      card.position = newPosition;
      await card.save();
    } else {
      // Move to different list:
      card.list = newListId;
      card.position = newPosition;
      await card.save();
    }

    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};