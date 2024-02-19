const mongoose = require('mongoose')
const validator = require('validator');

mongoose.pluralize(null)
const userShema = new mongoose.Schema({
    name:{
        type:String,
        // required:[true, "please add name"],
        trim:true
    },
    age:{
        type:Number,
        // required:[true, "please add name"],
        trim:true
    },
    gender:{
        type:String,
        // required:[true, "please add name"],
        trim:true
    },
    mobile:{
        type:Number,
        // required:[true, "please add name"],
        trim:true
    },
    address:{
        type:String,
        // required:[true, "please add name"],
        trim:true
    },
    occupation:{
        type:String,
        // required:[true, "please add name"],
        trim:true
    },
    DOB:{
        type:String,
        // required:[true, "please add name"],
        trim:true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        validate: {
            validator: validator.isEmail,
            message: 'is invalid'
        },
        index: true
    },
    password:{
        type:String,
        required:[true, "please add password"],
        min:6
    },
    doctorID:{
        type: String
    }
},{timestamps: true})

module.exports = mongoose.model('User', userShema)