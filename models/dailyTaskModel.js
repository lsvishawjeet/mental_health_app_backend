const mongoose = require('mongoose')
mongoose.pluralize(null)
const dailyTaskSchema = new mongoose.Schema({
    newActivity: {
        type: String,
        requird: true
    },
    timeIndexValue: {
        type: Number,
        required: true
    },
    selectedDate: {
        type: Number,
        required: true
    },
    selectedDay: {
        type: Number,
        required: true
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model('dailyTask', dailyTaskSchema)