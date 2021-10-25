const express = require('express')
const router = express.Router()
const Author = require('../models/authors')


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

module.exports = router