const mongoose = require('mongoose')
let d = Date(Date.now())
d = d.substring(0, d.length - 31);
const ArticleSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    time: {
        type: String,
        default: d
    }
})

module.exports = mongoose.model('Article', ArticleSchema)