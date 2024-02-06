const mongoose = require('mongoose');

// MongoDB connection
const mongoDBUri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
mongoose.connect(mongoDBUri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose;