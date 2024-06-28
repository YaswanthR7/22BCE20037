const express = require('express');
const router = express.Router();
const todo = require('../models/todo');

// Update a todo (title and description)
router.patch('/:id', async (req, res) => {
    try {
        const { title, description, done } = req.body;
        const updatedtodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description, done },
            { new: true }
        );
        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
