const mongoose = require('mongoose')
mongoose.pluralize(null)

const feelingSchema = new mongoose.Schema({
    feelNumber: {
        type: Number,
        required: true
    },
    feel: {
        type: String,
        required: true
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps:true})

module.exports = mongoose.model('Feel', feelingSchema)