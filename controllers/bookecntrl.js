const mongoose = require('mongoose');
const User = require('../models/user');
const Book = require('../models/book');
const Borrow = require('../models/borrow');

const checkMongoDBConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect('mongodb://127.0.0.1:27017/bookBorrowingApp', {
      
    });
    console.log('MongoDB connected successfully');
  }
};
exports.allcategories = (async (req, res) => {
    try {
      await checkMongoDBConnection()
      const categories = await Book.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);
      res.status(200).json({ data: categories });
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: err.message });
    }
  })
  
  exports.trendingbooks= (async (req, res) => {
    try {
      await checkMongoDBConnection()
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  
      const trendingBooks = await Borrow.aggregate([
        { $match: { borrowDate: { $gte: tenDaysAgo } } },
        {
          $group: {
            _id: '$bookId',
            borrowCount: { $sum: 1 }
          }
        },
        { $sort: { borrowCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: '_id',
            as: 'book'
          }
        },
        { $unwind: '$book' }
      ]);

      res.status(200).json({ data: trendingBooks})
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: err.message });
    }
  })
  
  exports.delayedreturn = (async (req, res) => {
    try {
      await checkMongoDBConnection()
      const delayedBooks = await Borrow.aggregate([
        { $match: { returnDate: { $exists: true, $ne: null } } },
        {
          $project: {
            bookId: 1,
            delay: { $subtract: ['$returnDate', '$borrowDate'] }
          }
        },
        { $sort: { delay: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'books',
            localField: 'bookId',
            foreignField: '_id',
            as: 'book'
          }
        },
        { $unwind: '$book' }
      ]);
      res.status(200).json({data:delayedBooks});
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: err.message });
    }
  })