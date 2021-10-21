
const express = require('express')
const app = express()
const router = require('./routes/index')
const expressLayouts = require('express-ejs-layouts')

app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.set('layout','layouts/layout')
app.use(express.static('public'))
app.use(expressLayouts)
app.use('/',router)

app.listen(process.env.PORT || 3000, ()=>{
    console.log('server is up and running!')
})