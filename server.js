// require deps
const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/book');
// initialize app
const app = express();

// configure settings
require('dotenv').config();

// connect to and configure mongoDB with mongoose

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

// set up mongodb event listeners
db.on('connected', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.log('MongoDB Error: ' + err.message));


// mount middleware
app.use(express.urlencoded({ extended: false })); // creates req.body

// mount routes

// Index Route
app.get('/books', (req, res) => {
    Book.find({}, (err, books) => {
        res.render('index.ejs', { books });
    });
});


// New Route
app.get('/books/new', (req, res) => {
    res.render('new.ejs');
});

// Create Route
app.post('/books', (req, res) => {
    if(req.body.completed === 'on') {
        req.body.completed = true;
    } else {
        req.body.completed = false;
    }
    Book.create(req.body, (err, book) => {
        res.redirect('/books');
    });
});

// tell the app to listen

const PORT = process.env.PORT; 
// heroku or any cloud service will set this value for us

app.listen(PORT, () => {
    console.log('Express is listening on port: ' + PORT);
});