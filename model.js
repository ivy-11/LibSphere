const mongoose = require('mongoose');

// Book Schema 
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    copies: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Shelf Schema
const shelfSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  capacity: { type: String, required: true },
  booksCount: { type: Number, default: 0 },
  color: { type: String, required: true }
});

// Seat Schema
const seatSchema = new mongoose.Schema({
  seatNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  status: { 
    type: String, 
    enum: ['Available', 'Booked', 'Maintenance'], 
    default: 'Available' 
  },
  bookedBy: { 
    type: String, 
    default: null 
  },
  bookedAt: { 
    type: Date, 
    default: null 
  }
}, { timestamps: true });

// Models
const Book = mongoose.model('Book', bookSchema);
const Shelf = mongoose.model('Shelf', shelfSchema);
const Seat = mongoose.model('Seat', seatSchema);

// Export both models
module.exports = { Book, Shelf, Seat };