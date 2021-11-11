//const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const s3 = require('./s3')

const router = require('./routes/index')
const bookRouter = require('./routes/books')
const bodyParser = require('body-parser')
const authorRouter = require('./routes/authors')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
.then(d => console.log('connected to the database!'))
.catch(e => console.log(e))
app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.set('layout','layouts/layout')
app.use(express.static('public'))
app.use(expressLayouts)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',router)
app.use('/author',authorRouter)
app.use('/book',bookRouter)
app.get('/image/:id',async (req,res)=>{
    let key = req.params.id 
    let readStream = s3.getFileStream(key)
    readStream.pipe(res)
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log('server is up and running!')
})
