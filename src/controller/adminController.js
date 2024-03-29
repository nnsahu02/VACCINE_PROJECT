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

//GET REGISTERED SLOT DATA
const getRegisteredSlot = async (req, res) => {
    try {
        const queryData = req.query
        const date = req.body.date

        const { Age, Pincode, VaccinationStatus } = queryData

        let filter = { date: date }

        if (Age) {
            ageNum = parseInt(Age)
            const data = await registerSlotModel.find({ registered: { $elemMatch: { age: Age } } })
            return res.status(200).send({ status: true, message: "user with slot Details", data: data })
        }

        if (Pincode) {
            const data = await registerSlotModel.find({ registered: { $elemMatch: { pincode: Pincode } } })
            return res.status(200).send({ status: true, message: "user with slot Details", data: data })
        }

        if (VaccinationStatus) {
            filter.vaccinated = VaccinationStatus
        }

        const allData = await registerSlotModel.find(filter)

        return res.status(200).send({ status: true, message: "user with slot Details", data: allData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//UPDATE VACCINATION STATUS
const updateVaccineStatus = async (req, res) => {
    try {
        const registerSlotData = await registerSlotModel.find({ $or: [{ vaccinated: "NA" }, { vaccinated: "First" }] })
        if (registerSlotData.length == 0) {
            return res.status(404).send({ status: false, message: "No user found to update vaccination status" })
        }
        let arr = []
        for (let i = 0; i < registerSlotData.length; i++) {
            let data = registerSlotData[i]
            let userId = data.userId
            const userData = await registerSlotModel.findOne({ userId })

            if (userData.vaccinated != 'Both') {
                if (userData.registered[0].dose[0] == 'First') {
                    const update = await registerSlotModel.findOneAndUpdate(
                        { userId: userId },
                        { $set: { vaccinated: ["First"] } },
                        { new: true }
                    )
                    arr.push(update)
                }
                if (userData.registered[0].dose[0] == 'Second') {
                    const update = await registerSlotModel.findOneAndUpdate(
                        { userId: userId },
                        { $set: { vaccinated: ["Both"] } },
                        { new: true }
                    )
                    arr.push(update)
                }
            }
        }
        return res.status(200).send({ status: true, message: "Vaccine status Updated.", data: arr })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//get Slot Data 
const getSlot = async (req, res) => {
    try {
        const date = req.body.date
        if (!date) {
            return res.status(400).send({ status: false, message: "Please provide date in request body." })
        }
        const data = await timeSlotModel.find({ date }).sort({ time: 1 })
        return res.status(200).send({ status: true, message: `slots for ${date} are :-`, data: data })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//Admin vaccine slots API
const registerVaccineSlot = async (req, res) => {
    try {
        const date = req.body.date
        const doseData = req.query.dose

        if (doseData) {
            const regData = await registerSlotModel.find({ registered: { $elemMatch: { dose: doseData } } })
            let len = regData.length

            let arr = []
            for (let i = 0; i < len; i++) {
                if (regData[i].date == date) {
                    if (regData[i].vaccinated != "Both") {
                        if (regData[i].vaccinated == "NA" || (regData[i].vaccinated == "First" && regData[i].registered[0].dose[0] == "Second"))
                            arr.push(regData[i])
                    }
                }
            }
            if (arr.length == 0) {
                return res.status(200).send({ status: true, message: `no user register for vaccination in ${date}` })
            }
            return res.status(200).send({
                status: true,
                message: `There are ${arr.length}  user registered for ${doseData} dose in ${date}.`, data: arr
            })
        }

        const data = await registerSlotModel.find({ date: date })
        let arr = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].vaccinated != "Both") {
                if (data[i].vaccinated == "NA" || (data[i].vaccinated == "First" && data[i].registered[0].dose[0] == "Second"))
                    arr.push(data[i])
            }
        }
        if (arr.length == 0) {
            return res.status(200).send({ status: true, message: `no user register for vaccination in ${date}` })
        }
        return res.status(200).send({
            status: true,
            message: `There are ${arr.length}  user registered for ${doseData} dose in ${date}.`, data: arr
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createSlot, loginAdmin, updateVaccineStatus, getRegisteredSlot, getSlot, registerVaccineSlot }