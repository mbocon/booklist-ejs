const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    firstName: String,
    lastName: String,
    dob: String,
}, { timestamps: true });


module.exports = mongoose.model('Author', authorSchema);