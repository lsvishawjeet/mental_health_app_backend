const JWT = require('jsonwebtoken')
const validator = require('validator');

const {
    hashPassword,
    comparePassword
} = require("../helpers/authHelper");
const doctorModel = require("../models/doctorModel");
const {
    expressjwt: jwt
} = require('express-jwt');
const {
    response
} = require('express');
const userModel = require('../models/userModel');
const weeklyTestModel = require('../models/weeklyTestModel');
const sleepModel = require('../models/sleepModel');
const feelingModel = require('../models/feelingModel');

//middleware
const requireSingIn = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});

const registerController = async (req, res) => {
    try {
        const {
            email,
            password,
            name,
            age,
            gender,
            mobile,
            role
        } = req.body

        //validation
        // if (!name) {
        //     return res.status(400).send({
        //         success: false,
        //         message: "name is required"
        //     })
        // }
        if (!name || !gender) {
            return res.status(400).send({
                success: false,
                message: 'All fields are compulsory'
            });
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "email is required"
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).send({
                success: false,
                message: "enter correct email"
            })
        }
        if (!password || password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "password is required and 6 character long"
            })
        }


        //existing user
        const existingUser = await doctorModel.findOne({
            email: email
        })
        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: 'Doctor already registered'
            })
        }
        //hash password
        const hashedPassword = await hashPassword(password)
        //save user
        const user = await doctorModel({
            // name,
            email,
            name,
            password: hashedPassword,
            age,
            gender,
            mobile,
            role
        }).save();

        return res.status(201).send({
            success: true,
            message: 'registration successfull please login'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error in register api",
            error
        })
    }
};


//login 
const loginController = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find User
        const user = await doctorModel.findOne({
            email
        });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }

        // Match password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).send({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Token JWT
        const token = await JWT.sign({
            _id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        // Undefine password
        user.password = undefined;

        // Send Response
        res.status(200).send({
            success: true,
            message: 'Login successful',
            token,
            user
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: 'Error in login API'
        });
    }
};

//check user email
const doctorCheckController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'Enter correct email'
            });
        }

        const existingUser = await doctorModel.findOne({ email });

        if (existingUser) {
            console.log('User exists');
            return res.status(409).send({
                success: false,
                message: 'User already registered'
            });
        }

        res.status(200).send({
            success: true,
            message: 'New user'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Internal server error'
        });
    }
};


// const updateController = async (req, res) => {
//     try {
//         const {
//             name,
//             age,
//             gender,
//             mobile,
//             address,
//             doctorID
//         } = req.body

//         //user find
//         const user = await userModel.findOne({
//             email,
//             age,
//             gender,
//             mobile,
//             address,
//             doctorID
//         })

//         //update user
//         const updatedUser = await userModel.findOneAndUpdate({
//             email,
//             age,
//             gender,
//             mobile,
//             address,
//             doctorID
//         }, {
//             name: name || user.name
//         },{new: true})
//         res.status(200).send({
//             status: true,
//             message: 'updated',
//             updatedUser
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success: false,
//             message: 'error in update api',
//             error
//         })
//     }
// }
const updateController = async (req, res) => {
    try {
        const {
            name,
            age,
            gender,
            mobile,
            address,
            occupation,
            DOB,
            email,
            lastTestDate
        } = req.body

        // Find the user by userId
        const userID = req.params.userID
        const user = await doctorModel.findById(userID);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }

        // Update user fields
        if (name) user.name = name;
        if (age) user.age = age;
        if (gender) user.gender = gender;
        if (mobile) user.mobile = mobile;
        if (address) user.address = address;
        if (occupation) user.occupation = occupation;
        if (DOB) user.DOB = DOB;
        if (lastTestDate) user.lastTestDate = lastTestDate;


        // Save the updated user
        const updatedUser = await user.save();
        updatedUser.password = undefined

        console.log(`Updated User: ${updatedUser}`)
        res.status(200).send({
            success: true,
            message: 'User updated successfully',
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in update API',
            error
        });
    }
}

const doctorGetUser=async(req,res)=>{
    try {
        let user = await userModel.find({doctorID: req.params._id})
        if(user){
            res.status(200).send(user)
        }
    } catch (error) {
        res.status(500).send({
            message: error
        })
    }
}
const doctorGetUserTestReport=async(req,res)=>{
    try {
        let result = await weeklyTestModel.find({postedBy: req.params._id})
        if(result){
            res.status(200).send(result)
        }
    } catch (error) {
        res.status(500).send({
            message: error
        })
    }
}

const doctorGetUSerMoodReport = async(req,res)=>{
    try {
        const feel = await feelingModel.find({postedBy: req._id})
        res.status(200).send({
            success: true,
            message: 'feel',
            feel
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: 'error in feel api',
            err
        });
    }
}
module.exports = {
    registerController,
    loginController,
    updateController,
    doctorCheckController,
    doctorGetUserTestReport,
    requireSingIn,
    doctorGetUser,
    doctorGetUSerMoodReport
}