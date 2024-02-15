const express = require('express')
const { requireSingIn } = require('../controller/userController')
const { createDailyTaskController, getDailyTasksController } = require('../controller/dailyTaskController')

//router object
const router = express.Router()

//send data
router.post('/send', requireSingIn, createDailyTaskController)

//get data
router.get('/get',requireSingIn, getDailyTasksController)

//export
module.exports = router  