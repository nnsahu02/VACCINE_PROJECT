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



//ADMIN APIs
//createSlot
router.post('/:adminId/slots/day', adminController.createSlot)

//GET REGISTERED SLOT DATA
router.get('/:adminId/registered/slot', adminController.getRegisteredSlot)

//UPDATE VACCINATION STATUS
router.put("/:adminId/update/status", adminController.updateVaccineStatus)

module.exports = router