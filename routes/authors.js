const express = require('express')
const router = express.Router()
const Author = require('../models/authors')
const Book = require('../models/books')
const paginator = require('../pagination')

// home page for showing the authors data 
router.get('/',async (req,res)=>{
    let filter = {}
    let search_input = ''
    if(req.query.search!=null)
    {
        filter.name = new RegExp(req.query.search,'i')
        search_input = req.query.search
    }
    let data = await Author.find(filter)
    res.render('authors/index',{author_list:data,search:search_input})
})

router.get('/new',async (req,res)=>{
    res.render('authors/new',{author: new Author(),errorMessage:''
    })
})

// post end point for creating new author 
router.post('/',async (req,res)=>{
   //storing to the database 
   try{
   let author = await Author.create({name:req.body.name})
   res.redirect('/author')
   }
   catch{
       res.render('authors/new',{author:req.body,
        errorMessage:'Error while Adding Author!'})
   }

})


// get  now we need to have urls to show authors  which will shows authors details along with his/her books
router.get('/:id',async (req,res)=>{
   try
   {
       let page = req.query.page!=null? Number(req.query.page) : 1 
       let author = await Author.findById(req.params.id)
       let booksByAuthor = await Book.find({author:req.params.id}).limit(6).exec()
        let pageObj = paginator(booksByAuthor,page)
       res.render('authors/show.ejs',{author,pageObj})
   }
   catch 
   {
       res.redirect('/author')
   }
})
// get author edit form details pre loaded with the data of the author
router.get('/:id/edit',async (req,res)=>{
    try
    {
        let author = await Author.findById(req.params.id)
        res.render('authors/edit',{author:author})
    }
    catch
    {
        res.redirect(`/author`)
    }
})
// put to update the author data 
router.put('/:id',async (req,res)=>{
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect('/author')
    } catch {
        res.render('authors/edit',{author:author,errorMessage:"some error occured while updating!"})
    }
})
// delete to delete the existing author, do only when there is no book under that author 
router.delete('/:id', async (req,res)=>{
    try
    {
        let author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/author')
    }
    catch(e)
    {
        res.redirect('/author')
    }
})



module.exports = router