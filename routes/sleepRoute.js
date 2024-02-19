const express = require('express')
const { requireSingIn } = require('../controller/userController')
const { createSleepController, getSleepController } = require('../controller/sleepController')

//router object
const router = express.Router()

//send data
router.post('/send', requireSingIn, createSleepController)

//get data
router.get('/get',requireSingIn, getSleepController)

//export
module.exports = router  