// require dependencies
const express = require('express');
// create a router object
const booksRouter = express.Router();

const Book = require('../models/book');
// list our router actions

// Seed route

// We are already at /books/

booksRouter.get('/seed', async (req, res) => {
    const data = [
        {
            title: 'The Art of War',
            author: 'Sun Tzu',
            qty: 5
        },
        {
            title: 'How to Win Friends and Influence People',
            author: 'Dale Carnegie',
            qty: 5
        },
        {
            title: 'Think & Grow Rich',
            author: 'Napolean Hill',
            qty: 5
        },
        {
            title: 'Rich Dad Poor Dad',
            author: 'Robert Kiyosaki',
            qty: 5
        },
    ];
    await Book.deleteMany({});
    await Book.create(data);
    res.redirect('/books');
});


booksRouter.get('/destroy-data', async (req, res) => {
    await Book.deleteMany({});
    res.redirect('/books');
});


// Index Route
booksRouter.get('/', (req, res) => {
    Book.find({}, (err, books) => {
        res.render('index.ejs', { books });
    });
});


// New Route
booksRouter.get('/new', (req, res) => {
    res.render('new.ejs');
});


// Delete Route

booksRouter.delete('/:id', (req, res) => {
    Book.findByIdAndRemove(req.params.id, (err, deletedBook) => {
        res.redirect('/books');
    });
});

// Update route

booksRouter.put('/:id', (req, res) => {
    req.body.completed = !!req.body.completed; // !!'on' === true || !!undefined === false
    Book.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true },
        (err, book) => {
          res.redirect(`/books/${req.params.id}`)
    });
});


// Create Route
booksRouter.post('/', (req, res) => {
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

booksRouter.get('/:id/edit', (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        res.render('edit.ejs', { book });
    });
});


// Show route

booksRouter.get('/:id', (req, res) => {
    // Book.findById(req.params.id).then(() => {
    //     res.render('show.ejs', { book })
    // });

    Book.findById(req.params.id, (err, book) => {
        res.render('show.ejs', { book });
    });
});
// export the router object so that we require it in server.js


// Buy Route
booksRouter.post('/:id/buy', (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        if(book.qty) {
            book.qty--
            book.save(() => {
                res.redirect(`/books/${book._id}`);
            });
        } else {
            res.redirect(`/books/${book._id}`);
        }
    });
});

module.exports = booksRouter;