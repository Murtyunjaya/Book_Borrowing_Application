const express = require('express');

const router = express.Router()
const bookecontroller = require('../controllers/bookecntrl')

router.get('/all-categories',bookecontroller.allcategories)
  
router.get('/trending-books',bookecontroller.trendingbooks)
  
router.get('/delayed-return',bookecontroller.delayedreturn)

module.exports= router