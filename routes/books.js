const express = require('express')
const Book = require('../models/books')
const Author = require('../models/authors')
let s3 = require('../s3')
const router = express.Router()
const paginator = require('../pagination')

//multer part 
const fs = require('fs')
const path = require('path')
const uploadPath = path.join('public','uploads')
const multer  = require('multer')
const upload = multer({ dest: uploadPath })


router.get('/',async (req,res)=>{
    try
    {
        searchParamters = {}
        let page = req.query.page!=null? Number(req.query.page) : 1 
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
        const pageObj = paginator(books,page)
        res.render('books/index',{pageObj,searchItems:req.query})
    }
    catch
    {
        let pageObj = {
            books:[],
            pagination:false 
        }
        res.render('books/index',{pageObj,searchItems:req.query})
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
    let bookObj
    try
    {
        const fileName = req.file!=null? req.file.filename : null
        if(fileName!=null)
        {
            const result_s3 = await s3.upload(req.file)
            fs.unlink(path.join(uploadPath,fileName),err=> {
                if(err)
                console.log(err)})
        }   
            bookObj = {
            title:req.body.title,
            author:req.body.author,
            pageCount:req.body.pageCount,
            publishedDate:new Date(req.body.publishedDate),
            description:req.body.description,
            coverImageName: fileName
        }
        let obj = await Book.create(bookObj)
        console.log('book added successfully!')
        res.redirect(`/book/${obj.id}`)
    }
    catch
    {
        try{
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


//showing book page 
router.get('/:id',async (req,res)=>{
    try{
        let book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show',{book:book})
    }
    catch{
        res.redirect('/')
    }
})

//editing page 
router.get('/:id/edit',async (req,res)=>{
    try{
        let mybook = await Book.findById(req.params.id)
        let book = {}
        book.id = mybook.id
        book.title = mybook.title
        book.description=mybook.description
        book.pageCount = mybook.pageCount 
        book.publishedDate = getStringDate(mybook.publishedDate)
        book.author = mybook.author 
        let authors = await Author.find({})
        res.render('books/edit',{book,authorList:authors})
    }
    catch{
        res.redirect('/')
    }
})

//updating the book data 
router.put('/:id',upload.single('cover'),async (req,res)=>{
    let book 
    try{
        let file_name = req.file!=null ? req.file.filename : null 
        if(file_name!=null)
        {
            await s3.upload(req.file)
            fs.unlink(path.join(uploadPath,file_name),err=>{
                if(err)
                console.log(err)
            })
        }
        book = await Book.findById(req.params.id)
        book.title = req.body.title 
        book.author = req.body.author 
        book.publishedDate = new Date(req.body.publishedDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if(file_name!=null)
            book.coverImageName = file_name 
        await book.save()
        res.redirect(`/book/${req.params.id}`)
    }
    catch{
        try{
            let authors = await Author.find({})
            let mybook = {}
            mybook.id = book.id
            mybook.title = book.title
            mybook.description=book.description
            mybook.pageCount = book.pageCount 
            mybook.publishedDate = getStringDate(book.publishedDate)
            mybook.author = book.author 
            res.render('books/edit',{book:mybook,authorList:authors,errorMessage:"Error while Upating the date!"})
        }
        catch{
            res.redirect('/')
        }
    }
})

//deleting a particular book 
router.delete('/:id',async (req,res)=>{
    try{
        let book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/book')
    }   
    catch{
        res.redirect('/')
    }
})



module.exports = router 