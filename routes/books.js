const express = require('express')
const Book = require('../models/books')
const Author = require('../models/authors')
const router = express.Router()

//multer part 
const fs = require('fs')
const path = require('path')
const baseUploadUrl = require('../models/books').baseUploadUrl
console.log(baseUploadUrl)
const uploadPath = path.join('public',baseUploadUrl)

const multer  = require('multer')
const upload = multer({ dest: uploadPath })


router.get('/',async (req,res)=>{
    try
    {
        searchParamters = {}
        if(req.query.title)
            searchParamters.title = new RegExp(req.query.title,'i')
        if(req.query.leftRangeDate && req.query.rightRangeDate)
            searchParamters.publishedDate = {$gte:req.query.leftRangeDate,$lte:req.query.rightRangeDate}
        else if(req.query.leftRangeDate)
            searchParamters.publishedDate = {$gte:req.query.leftRangeDate}
        else if(req.query.rightRangeDate)
            searchParamters.publishedDate = {$lte:req.query.rightRangeDate}
        //filtering here
        const books = await Book.find(searchParamters)
        res.render('books/index',{books:books,searchItems:req.query,uploadPath:uploadPath})
    }
    catch
    {
        res.render('books/index',{books:[],searchItems:req.query})
    }
})


router.get('/new', async (req,res)=>{
    try
    {
        let authorList = await Author.find({})
        let book = new Book()
        let params = {
            authorList : authorList,
            book :book,
            errorMessage:''
        }
        res.render('books/new',params)
    }
    catch{
        res.redirect('/book/new')
    }
    
})

//get string dtae 
let getStringDate = (date)=>{
    let dd = date.getDate()<10? '0'+date.getDate() : date.getDate()
    let mm = date.getMonth()<9? '0'+(date.getMonth()+1) : 1+date.getMonth()
    let yyyy = date.getFullYear()
    return yyyy+'-'+mm+'-'+dd
}


router.post('/',upload.single('cover'),async (req,res)=>{
    const fileName = req.file!=null? req.file.filename : null
    const bookObj = {
        title:req.body.title,
        author:req.body.author,
        pageCount:req.body.pageCount,
        publishedDate:new Date(req.body.publishedDate),
        description:req.body.description,
        coverImageName: fileName
    }
    try
    {
        let obj = await Book.create(bookObj)
        console.log('book added successfully!')
        res.redirect('/book')
    }
    catch
    {
        try{
            if(fileName!=null)
            fs.unlink(path.join(uploadPath,fileName),err=> {
                if(err)
                console.log(err)})
            let params = {}
            let authorList = await Author.find({})
            params.authorList=authorList
            bookObj.publishedDate = getStringDate(bookObj.publishedDate)
            params.errorMessage="Something went Wrong Try again!"
            params.book = bookObj
            res.render('books/new',params)
        }
        catch{
            res.redirect('/book/new')
        }
    }
   
})


module.exports = router 