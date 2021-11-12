const express = require('express')
const Book = require('../models/books')
const router = express.Router()

router.get('/',async (req,res)=>{
    try{
        let books = await Book.find({}).sort({publishedDate:"desc"}).limit(6).exec()
        res.render('index',{books})
    }   
    catch{
        res.render('errorPage')
    }
})

module.exports = router 