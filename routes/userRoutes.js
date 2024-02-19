const express = require("express")
const { registerController, loginController, updateController, requireSingIn, userCheckController } = require("../controller/userController")

//route object
const router = express.Router()

//routes
//Register
router.post('/register', registerController)

//Login
router.post('/login', loginController)

//update
router.put('/update/:userID',requireSingIn, updateController)

//check
router.post('/check', userCheckController)

//export
module.exports = router