const mongoose = require('mongoose')
mongoose.pluralize(null)
const weeklyTestSchema = new mongoose.Schema({
    score:{
        type: Number,
        required: true
    },
    answers:{
        type: Array,
        required: true
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model('weeklyTest', weeklyTestSchema)