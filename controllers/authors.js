const express = require('express');
const authorsRouter = express.Router();
const Author = require('../models/author');

authorsRouter.get('/new', (req, res) => {
    res.render('authors/new.ejs');
});

authorsRouter.post('/', async (req, res) => {
    await Author.create(req.body);
    res.redirect('/books');
});


module.exports = authorsRouter;