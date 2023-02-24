const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    Date : {
        type : Date,
        required : false,
        default : Date.now
    }
})

module.exports = mongoose.model('posts',postSchema)