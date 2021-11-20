// require dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define the schema
const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    completed: Boolean,
    qty: { type: Number, default: 5}
}, { timestamps: true });

// export the model to be accessed in server.js
module.exports = mongoose.model('Book', bookSchema);