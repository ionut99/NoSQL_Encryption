const mongoose = require('../utils/database')

const Schema = mongoose.Schema;

// Unencrypted Book Schema
/* const BookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true, unique: true },
    year: { type: String, required: true },
}); */

// Encrypted Book Schema
const BookSchema = new Schema({
    uuid: { type: String, required: true },
    iv: { type: String, required: true, unique: true },
    encryptedData: { type: String, required: true },
});

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;