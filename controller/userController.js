const JWT = require('jsonwebtoken')
const {
    hashPassword,
    comparePassword
} = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const {expressjwt: jwt} = require('express-jwt')

//middleware
const requireSingIn = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  });

const registerController = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body

        //validation
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "name is required"
            })
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "email is required"
            })
        }
        if (!password || password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "password is required and 6 character long"
            })
        }

        //existing user
        const existingUser = await userModel.findOne({
            email: email
        })
        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: 'User already registered'
            })
        }
        //hash password
        const hashedPassword = await hashPassword(password)
        //save user
        const user = await userModel({
            name,
            email,
            password: hashedPassword
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
        const user = await userModel.findOne({
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

module.exports = {
    registerController,
    loginController,
    requireSingIn
}