const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const data = await books;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

/// Get book details based on ISBN
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;

        const book = await Promise.resolve(books[isbn]);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;

        const result = await Promise.resolve(
            Object.entries(books).filter(
                ([id, book]) => book.author === author
            )
        );

        const selectedbook = Object.fromEntries(result);

        res.status(200).json(selectedbook);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;

        const result = await Promise.resolve(
            Object.entries(books).filter(
                ([id, book]) => book.title === title
            )
        );

        const selectedbook = Object.fromEntries(result);

        res.status(200).json(selectedbook);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// Get book review
public_users.get('/review/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const selectedReview = {};

        const book = await Promise.resolve(books[isbn]);

        if (book) {
            selectedReview[isbn] = book.review;
        }

        res.status(200).json(selectedReview);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports.general = public_users;