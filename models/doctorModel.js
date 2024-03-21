const mongoose = require('mongoose')
const validator = require('validator');

mongoose.pluralize(null)
const doctorSchema = new mongoose.Schema({
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
    name:{
        type:String,
        required:[true, "please add name"],
        trim:true
    },
    gender:{
        type:String,
        required:[true, "please add gender"],
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
    age:{
        type: Number
    },
    role:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:[true, "please add password"],
        min:6
    }
},{timestamps: true})

module.exports = mongoose.model('Doctor', doctorSchema)