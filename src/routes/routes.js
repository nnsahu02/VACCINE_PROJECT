const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const adminController = require('../controller/adminController')
const auth = require('../middleware/auth')

//USER APIs
//REGISTER USER
router.post('/Register', userController.registerUser)

//LOGIN USER
router.post('/login', userController.login)

//GET SLOTES PER DAY
router.get('/:userId/slots', auth.authentication, auth.authorization, userController.getSlot)

//REGISTER SLOT
router.post('/:userId/slot/register', auth.authentication, auth.authorization, userController.registerSlot)

//Update registered vaccine slot 
router.put('/:userId/update/slot', auth.authentication, auth.authorization, userController.updateRegisteredSlot)



//ADMIN APIs
//createSlot
router.post('/:adminId/slots/day', auth.authentication, auth.adminAuthorization, adminController.createSlot)

//GET SLOTS PER DAY
router.get("/:adminId/slots/day", auth.authentication, auth.adminAuthorization, adminController.getSlot)

//GET USER REGISTERED FOR SLOT DATA  
router.get('/:adminId/user/registerslot', auth.authentication, auth.adminAuthorization, adminController.getRegisteredSlot)

//UPDATE VACCINATION STATUS
router.put("/:adminId/update/status", auth.authentication, auth.adminAuthorization, adminController.updateVaccineStatus)

//Admin vaccine slots API
router.get("/:adminId/register/vaccine/slot", auth.authentication, auth.adminAuthorization, adminController.registerVaccineSlot)

module.exports = router