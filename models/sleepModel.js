const mongoose = require('mongoose')
mongoose.pluralize(null)
const sleepSchema = new mongoose.Schema({
    bedTime: {
        type: String,
        required: [true, "please add bed time"]
    },
    wakeTime: {
        type: String,
        required: [true, "please add wake time"]
    },
    differenceInMill: {
        type: Number,
        required: [true, "please add difference"]
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Sleep', sleepSchema)