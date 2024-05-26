const mongoose = require('mongoose');

const connectDB = () => {
  return mongoose.connect('mongodb://localhost:27017/bookBorrowingApp', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  });
};

module.exports = connectDB;
