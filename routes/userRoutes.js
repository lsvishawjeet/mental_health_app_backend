const express = require("express")
const { registerController, loginController } = require("../controller/userController")

//route object
const router = express.Router()

//routes
//Register
router.post('/register', registerController)

//Login
router.post('/login', loginController)

//export
module.exports = router