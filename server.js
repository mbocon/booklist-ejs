// require deps
const express = require('express');
const mongoose = require('mongoose');

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
app.use(express.urlencoded({ extended: true })); // creates req.body

// mount routes


// tell the app to listen

const PORT = process.env.PORT; 
// heroku or any cloud service will set this value for us

app.listen(PORT, () => {
    console.log('Express is listening on port: ' + PORT);
});