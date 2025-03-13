const mongoose = require('mongoose')

const validator = require('validator')

mongoose.pluralize(null)

const emotionModelChatbot = new mongoose.Schema({
    emotionType:{
        type: String,
    },
    emotionReason:{
        type: String,
        default: "Not provided"
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
},{timestamps: true})

module.exports = mongoose.model('emotionModelChatbot', emotionModelChatbot)
 