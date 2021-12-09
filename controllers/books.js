// require dependencies
const express = require('express');
// create a router object
const booksRouter = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const cloudinary = require('cloudinary').v2;
// list our router actions

// Search Route

booksRouter.get('/search', async (req, res) => {
    const term = req.query.term;
    if(term) {
        const results = await Book.find({ title: { $regex: term }});
        res.json({ results });
    } else {
        // we are going to send the search page to the user
        res.render('search.ejs');
    }
});



// Nested Resource Routes
booksRouter.post('/:id/reviews', async (req, res) => {
    // find the book we need to make a review for
    const book = await Book.findById(req.params.id);
    // insert req.body (our review) into the review array for the found book
    book.reviews.push(req.body);
    // save the current state of the book document
    await book.save();
    // redirect back to the client
    res.redirect(`/books/${book._id}`);
});



// Seed route

// We are already at /books/

booksRouter.get('/seed', async (req, res) => {
    const data = [
        {
            title: 'The Art of War',
            qty: 5
        },
        {
            title: 'How to Win Friends and Influence People',
            qty: 5
        },
        {
            title: 'Think & Grow Rich',
            qty: 5
        },
        {
            title: 'Rich Dad Poor Dad',
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
booksRouter.get('/new', async (req, res) => {
    const authors = await Author.find({});
    res.render('new.ejs', { authors });
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

    const photo = req.files.coverImage;

    photo.mv(`./uploads/${photo.name}`);

    cloudinary.uploader.upload(`./uploads/${photo.name}`).then(result => {
        req.body.coverImage = result.secure_url;

        Book.create(req.body, (err, book) => {
            res.redirect('/books');
        });
    }).catch(error => console.log(error));
});


// Edit route

booksRouter.get('/:id/edit', (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        res.render('edit.ejs', { book });
    });
});


// Show route

booksRouter.get('/:id', async (req, res) => {
    const book = await Book.findById(req.params.id).populate('author');
    res.render('show.ejs', { book });
});



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