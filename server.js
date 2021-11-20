// require deps
const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/book');
const methodOverride = require('method-override');

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
app.use(methodOverride('_method'));
// mount routes

// Seed route

app.get('/books/seed', async (req, res) => {
    const data = [
        {
            title: 'The Art of War',
            author: 'Sun Tzu'
        },
        {
            title: 'How to Win Friends and Influence People',
            author: 'Dale Carnegie'
        },
        {
            title: 'Think & Grow Rich',
            author: 'Napolean Hill'
        },
        {
            title: 'Rich Dad Poor Dad',
            author: 'Robert Kiyosaki'
        },
    ];
    await Book.deleteMany({});
    await Book.create(data);
    res.redirect('/books');
});


app.get('/destroy-data', async (req, res) => {
    await Book.deleteMany({});
    res.redirect('/books');
});


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


// Delete Route

app.delete('/books/:id', (req, res) => {
    Book.findByIdAndRemove(req.params.id, (err, deletedBook) => {
        res.redirect('/books');
    });
});

// Update route

app.put('/books/:id', (req, res) => {
    req.body.completed = !!req.body.completed; // !!'on' === true || !!undefined === false
    Book.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true },
        (err, book) => {
          res.redirect('/books')
    });
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


// Edit route

app.get('/books/:id/edit', (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        res.render('edit.ejs', { book });
    });
});


// Show route

app.get('/books/:id', (req, res) => {
    // Book.findById(req.params.id).then(() => {
    //     res.render('show.ejs', { book })
    // });

    Book.findById(req.params.id, (err, book) => {
        res.render('show.ejs', { book });
    });
});

// tell the app to listen

const PORT = process.env.PORT; 
// heroku or any cloud service will set this value for us

app.listen(PORT, () => {
    console.log('Express is listening on port: ' + PORT);
});