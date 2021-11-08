const mongoose = require('mongoose')
const path = require('path')
const baseUploadUrl = 'uploads/books'
const Book = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    publishedDate:{
        type:Date,
        required:true,
    },
    pageCount:{
        type:Number,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Author'
    },
    createdAt:
    {
        type: Date,
        required:true ,
        default:Date.now
    },
    description:{
        type:String,
        required:true
    },
    coverImageName:{
        type:String,
        required:true
    }
})
Book.virtual('coverImagePath').get(function()
{
    if(this.coverImageName!=null)
    return  path.join('/',baseUploadUrl,this.coverImageName)
})

module.exports = mongoose.model('Book',Book)
module.exports.baseUploadUrl = baseUploadUrl 