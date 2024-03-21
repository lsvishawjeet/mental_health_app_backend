const mongoose = require('mongoose')
const validator = require('validator');

mongoose.pluralize(null)
const streakSchema = new mongoose.Schema({
    streak: {
        type: Number ,
        require: true
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model('Streak', streakSchema)