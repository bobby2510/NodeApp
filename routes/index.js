const express = require('express')
const Book = require('../models/books')
const router = express.Router()
const paginator = require('../pagination')


router.get('/',async (req,res)=>{
    try{
        let page = req.query.page!=null? Number(req.query.page) : 1 
        let books = await Book.find({}).sort({publishedDate:"desc"}).exec()
        let pageObj = paginator(books,page)
        res.render('index',{pageObj})
    }   
    catch{
        res.render('errorPage')
    }
})

module.exports = router 