const express = require("express")
const { registerController, loginController, updateController, requireSingIn, doctorCheckController, doctorGetUser,doctorGetUserTestReport, doctorGetUSerMoodReport } = require("../controller/doctorController")

//route object
const router = express.Router()

//routes
//Register
router.post('/doctor/register', registerController)

//Login
router.post('/doctor/login', loginController)

//update
router.put('/doctor/update/:userID',requireSingIn, updateController)

//check
router.post('/doctor/check', doctorCheckController)

//getPatientData
router.get('/doctor/getDetails/:_id', doctorGetUser)

//get Becks test report
router.get('/doctor/getTestReport/:_id', doctorGetUserTestReport)

//get Patient sleep data
router.get(`/doctor/getSleepReport/:_id`, doctorGetUSerMoodReport)


//export
module.exports = router