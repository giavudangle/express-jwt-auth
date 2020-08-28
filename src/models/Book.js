const mongoose = require('mongoose');


const BookSchema = mongoose.Schema({
  name:String,
  price:Number
})

const Book = mongoose.model('Book',BookSchema);
module.exports = Book;