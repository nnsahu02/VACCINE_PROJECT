const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const adminController = require('../controller/adminController')

//USER APIs
//REGISTER USER
router.post('/Register', userController.registerUser)

//LOGIN USER
router.post('/login', userController.login)

//GET SLOTES PER DAY
router.get('/slots', userController.getSlot)

//REGISTER SLOT
router.post('/:userId/slot/register', userController.registerSlot)

//Update registered vaccine slot 
router.put('/:userId/update/slot', userController.updateRegisteredSlot)



//ADMIN APIs
//createSlot
router.post('/:adminId/slots/day', adminController.createSlot)

//GET SLOTS PER DAY
router.get("/:adminId/slots/day", adminController.getSlot)

//GET USER REGISTERED FOR SLOT DATA  
router.get('/:adminId/user/registerslot', adminController.getRegisteredSlot)

//UPDATE VACCINATION STATUS
router.put("/:adminId/update/status", adminController.updateVaccineStatus)

//Admin vaccine slots API
router.get("/:adminId/register/vaccine/slot", adminController.registerVaccineSlot)

module.exports = router