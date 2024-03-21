const mongoose = require('mongoose')

const validator = require('validator')

mongoose.pluralize(null)

const faceDetectModel = new mongoose.Schema({
    score:{
        type: String,
        // required: true
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }
},{timestamps: true})

module.exports = mongoose.model('faceDetect', faceDetectModel)
 