const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',  // Add default empty string
    },
    done: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Todo', TodoSchema);
