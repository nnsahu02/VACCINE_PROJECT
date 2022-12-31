const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const adminModel = require('../model/adminModel')
const registerSlotModel = require('../model/registerSlotModel')
const timeSlotModel = require('../model/timeSlotModel')
const userModel = require('../model/userModel')
const { isValidId } = require('../validator/validation')

//loginAdmin
const loginAdmin = async (req, res) => {
    try {
        const { PhoneNumber, Password } = req.body

        if (!PhoneNumber)
            return res.status(400).send({ status: false, message: 'PhoneNumber is required' })
        if (!isValidMobile(PhoneNumber))
            return res.status(400).send({ status: false, message: "Please enter the valid PhoneNumber" })

        if (!Password)
            return res.status(400).send({ status: false, message: 'Password is required' })

        const adminData = await adminModel.findOne({ PhoneNumber: PhoneNumber })
        if (!adminData)
            return res.status(404).send({ status: false, message: "This PhoneNumber is not Registered." })

        let checkPassword = await bcrypt.compare(Password, adminData.Password)
        if (!checkPassword) {
            return res.status(401).send({ status: false, message: "Incorrect Password." })
        }

        const adminId = adminData._id
        const token = jwt.sign({ adminId: adminId.toString() }, "mypassword", { expiresIn: "24h" })

        const data = {
            adminId: adminId,
            token: token
        }

        return res.status(200).send({ status: true, message: "User login successfull", data: data })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//create Slot 
const createSlot = async (req, res) => {
    try {
        const adminId = req.params.adminId
        if (!isValidId(adminId)) {
            return res.status(400).send({ status: false, message: "Invalid AdminId." })
        }

        const date = req.body.date
        if (!date) {
            return res.status(400).send({ status: false, message: "Please provide date in body." })
        }

        // Set the start and end times for the vaccine slots
        const startTime = '10:00'
        const endTime = '17:00'

        // Calculate the duration of each slot in minutes
        const slotDuration = 30

        // Convert the start and end times to the number of minutes from the start of the day
        const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
        const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

        // Calculate the number of slots per day
        const slotPerDay = (endMinutes - startMinutes) / slotDuration

        // Create an array of objects representing the vaccine slots for the day
        const slots = []
        for (let i = 0; i < slotPerDay; i++) {

            let date = new Date()
            date.setHours(parseInt(startTime.split(':')[0]))
            date.setMinutes(i * slotDuration)
            const timeString = date.toTimeString()
            const time = timeString.substring(0, 5)
            slots.push({
                date: req.body.date,
                time: time,
                doses: 10
            })
        }

        // Create the vaccine slots
        const saveSlot = await timeSlotModel.create(slots)

        return res.status(201).send({ status: true, message: `${date}'s slot details.`, data: saveSlot })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createSlot, loginAdmin }