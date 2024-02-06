require('dotenv').config();

const express = require("express")
const cors = require("cors")

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

        // If user does not exist, create a new user
        const newBook = new Book(bookData);
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

        /*const jsonString = JSON.stringify(req.body);
        console.log(jsonString);
        console.log(req.body);

        const encrypted = encrypt(jsonString);
        console.log("Date criptate:")
        console.log(encrypted);*/
       /* const encrypted = encrypt(jsonString); // Assuming 'encrypt' is your encryption function
        console.log("Date criptate:")
        console.log(encrypted);
        */
        /*
        const decryptedString = decrypt(encrypted); // Assuming 'decrypt' is your decryption function
        const decryptedObject = JSON.parse(decryptedString);
        console.log("Date decriptate:");
        console.log(decryptedObject);
        */
        
        /*
        const keyIdentifier = "https://mongokeyvault24.vault.azure.net/keys/first-test-key/3bfc37dc5063430b9b48996aa318fe78";
        getKeyProperties(keyIdentifier)
        .then(() => {
            console.log("Key properties retrieved successfully.");
        })
        .catch(err => {
            console.error(err);
        });
        */

        getSecret("KVT-MESSAGE").catch((error) => console.log("Error:", error));

        //setSecret("FirstSecretFromApp", "FirstSecretValue");

        //const user = await addNewUser(req.body);
        console.log('Added user:', user);
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
        console.log('Insert new Book:', book);
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
        //
        const results = await Book.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } },
            { year: { $regex: query, $options: 'i' } }
        ]
        });
        //
        res.json(results);
        //
    } catch (error) {
        //
        console.error('Search error:', error);
        //
        res.status(500).send('Error performing search');
    }
});

app.listen(3001, () => {
    console.log("server is running")
})