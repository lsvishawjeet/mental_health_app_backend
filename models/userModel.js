const mongoose = require('mongoose')
mongoose.pluralize(null)
const userShema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "please add name"],
        trim:true
    },
    email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    password:{
        type:String,
        required:[true, "please add password"],
        min:6
    }
},{timestamps: true})

module.exports = mongoose.model('User', userShema)