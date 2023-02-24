const express = require('express')
const app = express()
require('dotenv').config()

const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', ()=> console.log(error))

const Users = require('./model/users')
const Posts = require('./model/posts')

db.once('open', async ()=> {
    if (await Users.countDocuments().exec() > 0) return console.log ('Users are already present')

    Promise.all([
        Users.create({ name : 'User 1' }),
        Users.create({ name : 'User 2' }),
        Users.create({ name : 'User 3' }),
        Users.create({ name : 'User 4' }),
        Users.create({ name : 'User 5' }),
        Users.create({ name : 'User 6' }),
        Users.create({ name : 'User 7' }),
        Users.create({ name : 'User 8' }),
        Users.create({ name : 'User 9' }),
        Users.create({ name : 'User 10' }),
        Users.create({ name : 'User 11' }),
        Users.create({ name : 'User 12' }),
        Users.create({ name : 'User 13' }),
    ]).then (()=> console.log('Added Users'))
})


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))

// Routes
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/posts',paginatedData(Posts), (req, res) =>{
    res.json(res.paginatedResults)
})

app.get('/users',paginatedData(Users), (req, res) => {
    res.json(res.paginatedResults)
})

function paginatedData(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
    
        const startIndex = (page - 1)* limit
        const endIndex = page * limit

        const results = {}

        // Check for the previous page and share its data
        if (startIndex > 0){
            results.previous = {
                page : page - 1 ,
                limit : limit
            }
        }
        // Check for the next page and share its data
        if (endIndex < await model.countDocuments().exec()){
            results.next = {
                page : page + 1,
                limit : limit
             }
        }

        try{
            results.result = await model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        } catch (ex) {
            res.status(500).json({message : ex.message})
        }
        

    }
}

app.listen(process.env.PORT || 5000)