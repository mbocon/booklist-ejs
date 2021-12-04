// require dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define the schema
const reviewSchema = new Schema({
    text: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    }
}, { timestamps: true });


const bookSchema = new Schema({
    title: { type: String, required: true, lowercase: true },
    author: { type: String, required: true, lowercase: true },
    completed: Boolean,
    qty: { type: Number, default: 5},
    reviews: [reviewSchema] // this results in us being able to insert documents in this array
}, { timestamps: true });

// export the model to be accessed in server.js
module.exports = mongoose.model('Book', bookSchema);