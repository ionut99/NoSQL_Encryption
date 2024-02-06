require('dotenv').config();

const express = require("express")
const cors = require("cors")

// generate an unique uuid for data encryption session
const {v4: uuidv4 } = require('uuid');

const {encrypt, decrypt, getSecret, setSecret} = require('./utils/custom_crypto')


const User = require('./models/UserSchema')
const Book = require('./models/BookSchema')

///

const app = express()
app.use(express.json())
app.use(cors())

app.post("/login", (req, res) => {
    const {email, password} = req.body;
    User.findOne({email: email})
    .then(user => {
        if(user) {
            if(user.password === password) {
                res.json("Success")
            } else {
                res.json("the password is incorrect")
            }

        } else {
            res.json("No record existed")
        }
    })
})


function containsSubstring(obj, substring) {
    return Object.values(obj).some(value =>
        String(value).toLowerCase().includes(substring.toLowerCase())
    );
}
  

async function addNewUser(userData) {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            // User already exists, handle as needed
            throw new Error('User already exists with this email');
        }

        // If user does not exist, create a new user
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        return savedUser;
    } catch (err) {
        console.error(err);
        // Handle the error appropriately
        throw err;
    }
}

async function insertNewBook(bookData) {
    try {
        // Check if book exist
        const existingBook = await Book.findOne({ title: bookData.title });

        if (existingBook) {
            // Book already exists, handle as needed
            throw new Error('Book with this title already exist in dataBase');
        }

        // encrypt book data
        const jsonString = JSON.stringify(bookData);
        //
        const encId = uuidv4(); // encryption Id
        
        const encryptedBook = encrypt(jsonString, encId);
        console.log("Book's encryption data:")
        console.log(encryptedBook);
        // encrypt book data
        // If user does not exist, create a new user
        const newBook = new Book(encryptedBook);
        const savedBook = await newBook.save();
        return savedBook;

    } catch (err) {
        console.error(err);
        // Handle the error appropriately
        throw err;
    }
}

app.post('/register', async (req, res) => {
    try {

        const user = await addNewUser(req.body);

        //console.log('Added user:', user);

        res.status(201).json({ message: "User successfully registered", user: user });
    } catch (error) {
        if (error.message === 'User already exists with this email') {
            res.status(409).json({ message: error.message }); // Conflict
        } else {
            res.status(500).json({ message: 'Internal server error' }); // Other errors
        }
    }
});

app.post('/submit', async (req, res) => {

    try {
        const book = await insertNewBook(req.body);
        //
        //console.log('Insert new Book:', book);
        //
        res.status(201).json({ message: "Book was successfully inserted", book: book });
        //
    } catch (error) {
        if (error.message === 'Book already exist with this title') {
            res.status(409).json({ message: error.message }); // Conflict
        } else {
            res.status(500).json({ message: 'Internal server error' }); // Other errors
        }
    }
});

// book search 
app.get('/booksearch', async (req, res) => {
    try {
        const { query } = req.query;
        const documents = await Book.find({});

        // Use map to transform documents into a promise array of decrypted items
        const decryptPromises = documents.map(async (item) => {
            const decryptedString = await decrypt(item); // Assuming 'decrypt' is your decryption function
            return JSON.parse(decryptedString);
        });

        // Wait for all decrypt operations to complete
        const decryptedItems = await Promise.all(decryptPromises);

        // Filter decrypted items based on the query
        const bookList = decryptedItems.filter(decryptedObject => containsSubstring(decryptedObject, query)).map(decryptedObject => ({
            title: decryptedObject.title,
            author: decryptedObject.author,
            year: decryptedObject.year
        }));

        // Send the filtered list as a response
        res.json(bookList);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).send('Error performing search');
    }
});

app.listen(3001, () => {
    console.log("server is running")
})