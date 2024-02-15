const express = require('express')
const {requireSingIn} = require('../controller/userController')
const { createFeelController, getFeelController } = require('../controller/feelController')

//router object
const router = express.Router()

//send data
router.post('/send', requireSingIn, createFeelController)

//get data
router.get('/get', requireSingIn, getFeelController)

//exports
module.exports = router