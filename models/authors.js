const mongoose = require('mongoose') 
const Book = require('./books')
const author = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

author.pre('remove',function(next){
  Book.find({author:this.id},(error,books)=>{
      if(error)
      {
          next(error)
      }
      else if(books.length>0)
      {
          next(new Error('Author is still having books'))
      }
      else 
      {
          next()
      }
  })
})

module.exports = mongoose.model('Author',author)