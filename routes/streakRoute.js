const express = require("express")
const { createStreakController, updateStreakController} = require("../controller/streakController")

const router = express.Router()

//send streak
router.post('/post')

//update streak
router.put('/put', )

//get streak
router.get('/get')


//export
module.exports = router