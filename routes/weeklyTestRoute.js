const express = require('express')
const { requireSingIn } = require('../controller/userController')
const {createWeeklyTestController, getWeeklyTestController} = require("../controller/weeklyTestController")

//router object
const router = express.Router()

//send data
router.post('/send', requireSingIn, createWeeklyTestController)

//get data
router.get('/get',requireSingIn, getWeeklyTestController)

//export
module.exports = router  