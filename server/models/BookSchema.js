const mongoose = require('../utils/database')

const Schema = mongoose.Schema;

// Book Schema
const BookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true, unique: true },
    year: { type: String, required: true },
});

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;