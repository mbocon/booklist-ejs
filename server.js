// require deps
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressFileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

const booksController = require('./controllers/books');
const authorsController = require('./controllers/authors');
// initialize app
const app = express();

// configure settings
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// connect to and configure mongoDB with mongoose

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

// set up mongodb event listeners
db.on('connected', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.log('MongoDB Error: ' + err.message));


// mount middleware
app.use(express.urlencoded({ extended: false })); // creates req.body
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(expressFileUpload({ createParentPath: true }))
// mount routes
app.use('/books', booksController);
app.use('/authors', authorsController);

// tell the app to listen

const PORT = process.env.PORT; 
// heroku or any cloud service will set this value for us

app.listen(PORT, () => {
    console.log('Express is listening on port: ' + PORT);
});
