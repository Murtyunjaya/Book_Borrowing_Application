const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/user');
const Book = require('./models/book');
const Borrow = require('./models/borrow');

// Connect to MongoDB


const seedData = async () => {
  try {
    await connectDB();
    // Check if data already exists
    const userCount = await User.countDocuments();
    const bookCount = await Book.countDocuments();
    const borrowCount = await Borrow.countDocuments();

    if (userCount > 0 || bookCount > 0 || borrowCount > 0) {
      console.log('Data already exists, skipping seeding.');
      mongoose.connection.close();
      return;
    }

    // Create Users
    const users = await User.insertMany([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'David' },
      { name: 'Eve' }
    ]);

    // Create Books
    const books = await Book.insertMany([
      { title: 'Book One', isbn: '111-1111111111', category: 'Fiction' },
      { title: 'Book Two', isbn: '222-2222222222', category: 'Science' },
      { title: 'Book Three', isbn: '333-3333333333', category: 'History' },
      { title: 'Book Four', isbn: '444-4444444444', category: 'Technology' },
      { title: 'Book Five', isbn: '555-5555555555', category: 'Fiction' },
      { title: 'Book Six', isbn: '666-6666666666', category: 'Science' }
    ]);

    // Create Borrow records
    const borrowDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 7);

    await Borrow.insertMany([
      { userId: users[0]._id, bookId: books[0]._id, borrowDate, returnDate },
      { userId: users[1]._id, bookId: books[1]._id, borrowDate, returnDate },
      { userId: users[2]._id, bookId: books[2]._id, borrowDate, returnDate: null },
      { userId: users[3]._id, bookId: books[3]._id, borrowDate, returnDate: null },
      { userId: users[4]._id, bookId: books[4]._id, borrowDate, returnDate: null },
      { userId: users[0]._id, bookId: books[5]._id, borrowDate, returnDate: null }
    ]);

    console.log('Data seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding data:', err);
    mongoose.connection.close();
  }
};

module.exports = seedData;
